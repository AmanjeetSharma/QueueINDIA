import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";
import { Booking } from "../models/booking.model.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Force timezone India
const TZ = "Asia/Kolkata";

// Get working days for a department
const getWorkingDays = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const { workingHours, bookingWindowDays = 7 } = department;

    const results = [];
    const today = dayjs().tz(TZ).startOf('day');

    for (let i = 0; i < bookingWindowDays; i++) {
        const date = today.add(i, "day");
        const dayKey = date.format("ddd"); // "Mon", "Tue", etc.

        const config = workingHours.find((w) => w.day === dayKey);

        if (!config) {
            // If day not configured in working hours, assume closed
            results.push({
                date: date.format("YYYY-MM-DD"),
                day: dayKey,
                isClosed: true,
                openTime: null,
                closeTime: null,
                isToday: i === 0,
                isPast: i < 0
            });
            continue;
        }

        results.push({
            date: date.format("YYYY-MM-DD"),
            day: config.day,
            isClosed: config.isClosed,
            openTime: config.isClosed ? null : config.openTime,
            closeTime: config.isClosed ? null : config.closeTime,
            isToday: i === 0,
            isPast: i < 0
        });
    }

    return res.status(200).json(
        new ApiResponse(200, results, "Available working days returned successfully")
    );
});

// Get available slots for a specific service and date
const getAvailableSlots = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;
    const { date } = req.query;

    if (!date) throw new ApiError(400, "Date query parameter is required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found in this department");

    // Check if service is active
    if (!service.priorityAllowed && service.priorityRequired) {
        throw new ApiError(400, "This service requires priority access");
    }

    // Get working hours for the date
    const dayOfWeek = dayjs(date).tz(TZ).format("ddd");
    const workingDay = department.workingHours.find((d) => d.day === dayOfWeek);

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    // Use service-specific token management or fallback to department
    const tokenManagement = service.tokenManagement || department.tokenManagement || {};

    // Check if slot windows are configured
    if (!tokenManagement.slotWindows || tokenManagement.slotWindows.length === 0) {
        // Generate slots based on start/end time and interval
        const slots = generateDynamicSlots(
            tokenManagement.slotStartTime || "10:00",
            tokenManagement.slotEndTime || "17:00",
            tokenManagement.timeBtwEverySlot || 15,
            tokenManagement.maxTokensPerSlot || 10
        );

        // Check bookings for each slot
        const results = await Promise.all(
            slots.map(async (slot) => {
                const totalBooked = await Booking.countDocuments({
                    department: deptId,
                    "service.serviceId": serviceId,
                    date,
                    slotTime: slot.time
                });

                return {
                    ...slot,
                    remaining: Math.max(0, slot.maxTokens - totalBooked),
                    isFullyBooked: totalBooked >= slot.maxTokens,
                    available: totalBooked < slot.maxTokens
                };
            })
        );

        return res.status(200).json(
            new ApiResponse(200, results, "Available slots fetched successfully")
        );
    }

    // Use configured slot windows
    const results = await Promise.all(
        tokenManagement.slotWindows.map(async (window) => {
            const slotTime = `${window.start}-${window.end}`;

            const totalBooked = await Booking.countDocuments({
                department: deptId,
                "service.serviceId": serviceId,
                date,
                slotTime
            });

            return {
                time: slotTime,
                start: window.start,
                end: window.end,
                maxTokens: window.maxTokens || tokenManagement.maxTokensPerSlot || 10,
                remaining: Math.max(0, (window.maxTokens || tokenManagement.maxTokensPerSlot || 10) - totalBooked),
                isFullyBooked: totalBooked >= (window.maxTokens || tokenManagement.maxTokensPerSlot || 10),
                available: totalBooked < (window.maxTokens || tokenManagement.maxTokensPerSlot || 10),
                slotWindow: window
            };
        })
    );

    // Filter out slots that are outside working hours
    const filteredResults = results.filter(slot => {
        if (!workingDay.isClosed) {
            const slotStartTime = convertToMinutes(slot.start);
            const slotEndTime = convertToMinutes(slot.end);
            const openTime = convertToMinutes(workingDay.openTime);
            const closeTime = convertToMinutes(workingDay.closeTime);

            return slotStartTime >= openTime && slotEndTime <= closeTime;
        }
        return false;
    });

    return res.status(200).json(
        new ApiResponse(200, filteredResults, "Available slots fetched successfully")
    );
});

// Helper function to generate dynamic slots
const generateDynamicSlots = (startTime, endTime, intervalMinutes, maxTokensPerSlot) => {
    const slots = [];
    let currentTime = convertToMinutes(startTime);
    const endTimeMinutes = convertToMinutes(endTime);

    while (currentTime + intervalMinutes <= endTimeMinutes) {
        const slotStart = convertToTimeString(currentTime);
        const slotEnd = convertToTimeString(currentTime + intervalMinutes);

        slots.push({
            time: `${slotStart}-${slotEnd}`,
            start: slotStart,
            end: slotEnd,
            maxTokens: maxTokensPerSlot,
            interval: intervalMinutes
        });

        currentTime += intervalMinutes;
    }

    return slots;
};

// Helper function to convert time string to minutes
const convertToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper function to convert minutes to time string
const convertToTimeString = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;
    const { date, slotTime, priorityType = "NONE", notes = "" } = req.body;

    // Validate required fields
    if (!date || !slotTime) {
        throw new ApiError(400, "Date and slotTime are required");
    }

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found in this department");

    // Check if department allows booking
    if (!department.isSlotBookingEnabled) {
        throw new ApiError(400, "Online booking is not enabled for this department");
    }

    // Check if date is within booking window
    const selectedDate = dayjs(date).tz(TZ);
    const today = dayjs().tz(TZ).startOf('day');
    const maxDate = today.add(department.bookingWindowDays || 7, 'day');

    if (selectedDate.isBefore(today) || selectedDate.isAfter(maxDate)) {
        throw new ApiError(400, `Selected date must be within ${department.bookingWindowDays || 7} days from today`);
    }

    // Check working hours for the date
    const dayOfWeek = selectedDate.format("ddd");
    const workingDay = department.workingHours.find((d) => d.day === dayOfWeek);

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    // Check slot availability
    const [slotStart, slotEnd] = slotTime.split('-');
    const slotStartMinutes = convertToMinutes(slotStart);
    const slotEndMinutes = convertToMinutes(slotEnd);

    // Validate slot time is within working hours
    if (!workingDay.isClosed) {
        const openTime = convertToMinutes(workingDay.openTime);
        const closeTime = convertToMinutes(workingDay.closeTime);

        if (slotStartMinutes < openTime || slotEndMinutes > closeTime) {
            throw new ApiError(400, "Selected slot is outside working hours");
        }
    }

    // Check capacity
    const tokenManagement = service.tokenManagement || department.tokenManagement || {};
    let maxTokens = tokenManagement.maxTokensPerSlot || 10;

    // Check if there's a specific slot window
    if (tokenManagement.slotWindows && tokenManagement.slotWindows.length > 0) {
        const slotWindow = tokenManagement.slotWindows.find(
            window => window.start === slotStart && window.end === slotEnd
        );
        if (slotWindow) {
            maxTokens = slotWindow.maxTokens || maxTokens;
        }
    }

    const totalBooked = await Booking.countDocuments({
        department: deptId,
        "service.serviceId": serviceId,
        date,
        slotTime
    });

    if (totalBooked >= maxTokens) {
        throw new ApiError(400, "Selected slot is fully booked");
    }

    // Check priority eligibility
    if (priorityType !== "NONE") {
        if (!service.priorityAllowed) {
            throw new ApiError(400, "Priority service is not allowed for this service");
        }

        const priorityCriteria = department.priorityCriteria || {};
        switch (priorityType) {
            case "SENIOR_CITIZEN":
                if (!req.user.age || req.user.age < (priorityCriteria.seniorCitizenAge || 60)) {
                    throw new ApiError(400, "You are not eligible for senior citizen priority");
                }
                break;
            case "PREGNANT_WOMEN":
                if (!priorityCriteria.allowPregnantWomen) {
                    throw new ApiError(400, "Pregnant women priority is not allowed in this department");
                }
                break;
            case "DIFFERENTLY_ABLED":
                if (!priorityCriteria.allowDifferentlyAbled) {
                    throw new ApiError(400, "Differently abled priority is not allowed in this department");
                }
                break;
        }
    }

    // Generate token number (next available for that day)
    const lastToken = await Booking.findOne(
        { department: deptId, date },
        { tokenNumber: 1 },
        { sort: { tokenNumber: -1 } }
    );

    const tokenNumber = (lastToken?.tokenNumber || 0) + 1;

    // Create booking
    const booking = await Booking.create({
        user: req.user._id,
        department: deptId,
        service: {
            serviceId: service._id,
            name: service.name,
            serviceCode: service.serviceCode
        },
        date,
        slotTime,
        slotWindow: {
            start: slotStart,
            end: slotEnd,
            maxTokens: maxTokens
        },
        status: service.isDocumentUploadRequired ? "PENDING_DOCS" : "APPROVED",
        priorityType,
        tokenNumber: tokenNumber,
        estimatedServiceTime: tokenManagement.timeBtwEverySlot || 15,
        notes,
        metadata: {
            queueType: tokenManagement.queueType || "Hybrid",
            isDocumentUploadRequired: service.isDocumentUploadRequired,
            departmentName: department.name,
            serviceRequiresDocs: service.isDocumentUploadRequired
        }
    });

    return res.status(201).json(
        new ApiResponse(201, booking, "Booking created successfully")
    );
});









// // Get user's bookings
// const getUserBookings = asyncHandler(async (req, res) => {
//     const { status, page = 1, limit = 10 } = req.query;

//     const filter = { user: req.user._id };
//     if (status) {
//         filter.status = status;
//     }

//     const bookings = await Booking.find(filter)
//         .populate('department', 'name departmentCategory')
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit);

//     const total = await Booking.countDocuments(filter);

//     return res.status(200).json(
//         new ApiResponse(200, {
//             bookings,
//             total,
//             page: parseInt(page),
//             totalPages: Math.ceil(total / limit),
//             limit: parseInt(limit)
//         }, "User bookings fetched successfully")
//     );
// });

// // Get specific booking
// const getBookingById = asyncHandler(async (req, res) => {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//         .populate('department', 'name address contact')
//         .populate('user', 'firstName lastName email phone');

//     if (!booking) {
//         throw new ApiError(404, "Booking not found");
//     }

//     // Check authorization (user can see their own, admins can see all)
//     if (booking.user.toString() !== req.user._id.toString() &&
//         req.user.role !== 'SUPER_ADMIN' &&
//         !req.user.managedDepartments?.includes(booking.department._id.toString())) {
//         throw new ApiError(403, "Not authorized to view this booking");
//     }

//     return res.status(200).json(
//         new ApiResponse(200, booking, "Booking fetched successfully")
//     );
// });

// // Update booking status (for admins)
// const updateBookingStatus = asyncHandler(async (req, res) => {
//     const { bookingId } = req.params;
//     const { status, rejectionReason, tokenNumber } = req.body;

//     const booking = await Booking.findById(bookingId);
//     if (!booking) throw new ApiError(404, "Booking not found");

//     // Check if user is admin of this department
//     const isDepartmentAdmin = req.user.managedDepartments?.includes(booking.department.toString());
//     if (req.user.role !== 'SUPER_ADMIN' && !isDepartmentAdmin) {
//         throw new ApiError(403, "Not authorized to update this booking");
//     }

//     // Update status
//     if (status) {
//         booking.status = status;
//     }

//     // Add rejection reason if provided
//     if (rejectionReason) {
//         booking.notes = rejectionReason;
//     }

//     // Assign token number if provided and status is APPROVED
//     if (tokenNumber && status === 'APPROVED') {
//         booking.tokenNumber = tokenNumber;
//     }

//     await booking.save();

//     return res.status(200).json(
//         new ApiResponse(200, booking, "Booking status updated successfully")
//     );
// });

// // Cancel booking (user initiated)
// const cancelBooking = asyncHandler(async (req, res) => {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId);
//     if (!booking) throw new ApiError(404, "Booking not found");

//     // Check if user owns this booking
//     if (booking.user.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "Not authorized to cancel this booking");
//     }

//     // Check if booking can be cancelled (only PENDING_DOCS or DOCS_SUBMITTED)
//     if (!['PENDING_DOCS', 'DOCS_SUBMITTED'].includes(booking.status)) {
//         throw new ApiError(400, `Booking cannot be cancelled in ${booking.status} status`);
//     }

//     booking.status = 'CANCELLED';
//     await booking.save();

//     return res.status(200).json(
//         new ApiResponse(200, booking, "Booking cancelled successfully")
//     );
// });

// // Upload documents for booking
// const uploadBookingDocuments = asyncHandler(async (req, res) => {
//     const { bookingId } = req.params;
//     const { documents } = req.body; // Array of { name, description, documentUrl }

//     const booking = await Booking.findById(bookingId);
//     if (!booking) throw new ApiError(404, "Booking not found");

//     // Check if user owns this booking
//     if (booking.user.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "Not authorized to upload documents for this booking");
//     }

//     // Check if booking is in correct status
//     if (booking.status !== 'PENDING_DOCS') {
//         throw new ApiError(400, `Documents cannot be uploaded in ${booking.status} status`);
//     }

//     // Validate documents
//     if (!documents || !Array.isArray(documents) || documents.length === 0) {
//         throw new ApiError(400, "At least one document is required");
//     }

//     // Add documents to booking
//     booking.submittedDocs = documents.map(doc => ({
//         name: doc.name,
//         description: doc.description || '',
//         isMandatory: doc.isMandatory || true,
//         documentUrl: doc.documentUrl,
//         status: 'PENDING'
//     }));

//     // Update status
//     booking.status = 'DOCS_SUBMITTED';
//     await booking.save();

//     return res.status(200).json(
//         new ApiResponse(200, booking, "Documents uploaded successfully")
//     );
// });

// // Get all bookings for a department (admin view)
// const getDepartmentBookings = asyncHandler(async (req, res) => {
//     const { deptId } = req.params;
//     const { date, status, serviceId, page = 1, limit = 20 } = req.query;

//     // Check if user is admin of this department
//     const isDepartmentAdmin = req.user.managedDepartments?.includes(deptId);
//     if (req.user.role !== 'SUPER_ADMIN' && !isDepartmentAdmin) {
//         throw new ApiError(403, "Not authorized to view bookings for this department");
//     }

//     const filter = { department: deptId };

//     if (date) filter.date = date;
//     if (status) filter.status = status;
//     if (serviceId) filter['service.serviceId'] = serviceId;

//     const bookings = await Booking.find(filter)
//         .populate('user', 'firstName lastName email phone')
//         .sort({ date: 1, tokenNumber: 1 })
//         .skip((page - 1) * limit)
//         .limit(limit);

//     const total = await Booking.countDocuments(filter);

//     return res.status(200).json(
//         new ApiResponse(200, {
//             bookings,
//             total,
//             page: parseInt(page),
//             totalPages: Math.ceil(total / limit),
//             limit: parseInt(limit)
//         }, "Department bookings fetched successfully")
//     );
// });
export {
    getWorkingDays,
    getAvailableSlots,
    createBooking,
    // getUserBookings,
    // getBookingById,
    // updateBookingStatus,
    // cancelBooking,
    // uploadBookingDocuments,
    // getDepartmentBookings
};