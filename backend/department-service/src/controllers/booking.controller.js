import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";
import { Booking } from "../models/booking.model.js";
import dayjs from "dayjs";
import {
    convertToMinutes,
    convertToTimeString,
    generateDynamicSlots,
    getCurrentIST,
    isSlotWithinWorkingHours,
    isDateWithinBookingWindow,
    TZ
} from "../utils/bookingUtils.js";










// Get working days for a department
const getWorkingDays = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const { workingHours, bookingWindowDays = 7 } = department;
    const results = [];
    const today = getCurrentIST().startOf('day');

    for (let i = 0; i < bookingWindowDays; i++) {
        const date = today.add(i, "day");
        const dayKey = date.format("ddd");

        const config = workingHours.find((w) => w.day === dayKey);

        if (!config) {
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

    console.log(`Working days fetched! Dept: ${deptId} | Days Count: ${results.length}`);

    return res.status(200).json(
        new ApiResponse(200, results, "Available working days fetched successfully")
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

    // FIX: Properly parse the date string to get day of week
    const selectedDate = dayjs(date).tz(TZ);
    const dayOfWeek = selectedDate.format("ddd");
    const workingDay = department.workingHours.find((d) => d.day === dayOfWeek);

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    // Rest of the function remains the same...
    // Use service-specific token management or fallback to department
    const tokenManagement = service.tokenManagement || department.tokenManagement || {};

    let slots = [];

    // Check if slot windows are configured
    if (!tokenManagement.slotWindows || tokenManagement.slotWindows.length === 0) {
        // Generate slots based on start/end time and interval
        slots = generateDynamicSlots(
            tokenManagement.slotStartTime || "10:00",
            tokenManagement.slotEndTime || "17:00",
            tokenManagement.timeBtwEverySlot || 15,
            tokenManagement.maxTokensPerSlot || 10
        );
    } else {
        tokenManagement.slotWindows.forEach((window) => {
            const generatedSlots = generateDynamicSlots(
                window.start,
                window.end,
                tokenManagement.timeBtwEverySlot || 15,
                window.maxTokens || tokenManagement.maxTokensPerSlot || 10
            );

            slots.push(...generatedSlots);
        });
    }


    // Filter slots within working hours
    const filteredSlots = slots.filter(slot =>
        isSlotWithinWorkingHours(slot, workingDay)
    );

    // Check bookings for each slot
    const results = await Promise.all(
        filteredSlots.map(async (slot) => {
            const totalBooked = await Booking.countDocuments({
                department: deptId,
                "service.serviceId": serviceId,
                date,
                slotTime: slot.time
            });

            const remaining = Math.max(0, slot.maxTokens - totalBooked);

            return {
                ...slot,
                remaining,
                isFullyBooked: remaining === 0,
                available: remaining > 0,
                bookedCount: totalBooked
            };
        })
    );

    console.log(`Available slots fetched! Dept: ${deptId} | Service: ${serviceId} | For Date: ${date}`);

    return res.status(200).json(
        new ApiResponse(200, results, "Available slots fetched successfully")
    );
});
















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
    if (!isDateWithinBookingWindow(date, department.bookingWindowDays || 7)) {
        throw new ApiError(400, `Selected date must be within ${department.bookingWindowDays || 7} days from today`);
    }

    // Check working hours for the date
    const selectedDate = dayjs(date).tz(TZ);
    const dayOfWeek = selectedDate.format("ddd");
    const workingDay = department.workingHours.find((d) => d.day === dayOfWeek);

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    // Parse slot time
    const [slotStart, slotEnd] = slotTime.split('-');
    const slotStartMinutes = convertToMinutes(slotStart);
    const slotEndMinutes = convertToMinutes(slotEnd);

    // Validate slot time is within working hours
    if (!isSlotWithinWorkingHours({ start: slotStart, end: slotEnd }, workingDay)) {
        throw new ApiError(400, "Selected slot is outside working hours");
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

    // Check priority eligibility - UPDATED: Removed age check
    if (priorityType !== "NONE") {
        if (!service.priorityAllowed) {
            throw new ApiError(400, "Priority service is not allowed for this service");
        }

        const priorityCriteria = department.priorityCriteria || {};
        switch (priorityType) {
            case "SENIOR_CITIZEN":
                if (!priorityCriteria.seniorCitizenAge) {
                    throw new ApiError(400, "Senior citizen priority is not available in this department");
                }
                // Note: Age verification will be done at the counter
                // We cannot check age here since user model doesn't have age field
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
            default:
                throw new ApiError(400, "Invalid priority type");
        }
    }

    // Generate token number (next available for that day)
    const lastToken = await Booking.findOne(
        { department: deptId, date },
        { tokenNumber: 1 },
        { sort: { tokenNumber: -1 } }
    );

    const tokenNumber = (lastToken?.tokenNumber || 0) + 1;

    // Determine initial status based on document requirement
    let initialStatus = "APPROVED";
    if (service.isDocumentUploadRequired) {
        initialStatus = "PENDING_DOCS";
    }

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
        status: initialStatus,
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

    console.log(`Booking created! Booking ID: ${booking._id} | User: ${req.user._id} | Name: ${req.user.name} | Token no. ${tokenNumber}`); 

    return res.status(201).json(
        new ApiResponse(201, booking, "Booking created successfully")
    );
});
















// Get user's bookings
const getUserBookings = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status } = req.query;

    const query = { user: userId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .sort({ date: 1, slotTime: 1 })
        .populate('department', 'name address contact')
        .lean();

    console.log(`User bookings fetched! User: ${userId} | Name: ${req.user.name} | Count: ${bookings.length}`);

    return res.status(200).json(
        new ApiResponse(200, bookings, "User bookings fetched successfully")
    );
});















// Get booking by ID
const getBookingById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "department",
            select: "name address contact"
        })
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // 🔒 HARD SECURITY CHECK
    if (booking.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this booking");
    }
    
    console.log(`Booking fetched! Booking ID: ${bookingId} | User: ${req.user._id} | Name: ${req.user.name}`);

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking fetched successfully")
    );
});
















// Cancel booking
const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // 🔒 Ownership check
    if (booking.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this booking");
    }

    // ❌ Business rules
    if (booking.status === "CANCELLED") {
        throw new ApiError(400, "Booking is already cancelled");
    }

    if (booking.status === "COMPLETED") {
        throw new ApiError(400, "Cannot cancel a completed booking");
    }

    booking.status = "CANCELLED";
    await booking.save();

    console.log(`Booking cancelled! Booking ID: ${bookingId} | User: ${req.user._id} | Name: ${req.user.name}`);

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking cancelled successfully")
    );
});


export {
    getWorkingDays,
    getAvailableSlots,
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
};