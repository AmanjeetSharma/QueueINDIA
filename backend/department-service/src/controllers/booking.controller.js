import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/Department.model.js";
import { Booking } from "../models/Booking.model.js";
import dayjs from "dayjs";
import {
    convertToMinutes,
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

    const selectedDate = dayjs(date).tz(TZ);
    const dayOfWeek = selectedDate.format("ddd");

    const workingDay = department.workingHours.find(d => d.day === dayOfWeek);
    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    /* ───────── TOKEN MANAGEMENT ───────── */

    const tokenManagement =
        service.tokenManagement || department.tokenManagement || {};

    let slots = [];

    if (!tokenManagement.slotWindows || tokenManagement.slotWindows.length === 0) {
        slots = generateDynamicSlots(
            tokenManagement.slotStartTime || "10:00",
            tokenManagement.slotEndTime || "17:00",
            tokenManagement.timeBtwEverySlot || 15,
            tokenManagement.maxTokensPerSlot || 10
        );
    } else {
        tokenManagement.slotWindows.forEach(window => {
            const generatedSlots = generateDynamicSlots(
                window.start,
                window.end,
                tokenManagement.timeBtwEverySlot || 15,
                window.maxTokens || tokenManagement.maxTokensPerSlot || 10
            );
            slots.push(...generatedSlots);
        });
    }

    /* ───────── FILTER BY WORKING HOURS ───────── */

    const filteredSlots = slots.filter(slot =>
        isSlotWithinWorkingHours(slot, workingDay)
    );

    /* ───────── OPTIMIZED BOOKING COUNT (NEW) ───────── */

    const bookingCounts = await Booking.aggregate([
        {
            $match: {
                department: new mongoose.Types.ObjectId(deptId),
                "service.serviceId": new mongoose.Types.ObjectId(serviceId),
                date,
                status: { $nin: ["CANCELLED", "REJECTED"] }
            }
        },
        {
            $group: {
                _id: "$slotTime",
                count: { $sum: 1 }
            }
        }
    ]);

    // Convert aggregation result into lookup map
    const bookingMap = {};
    bookingCounts.forEach(b => {
        bookingMap[b._id] = b.count;
    });

    /* ───────── FINAL SLOT CALCULATION ───────── */

    const results = filteredSlots.map(slot => {
        const bookedCount = bookingMap[slot.time] || 0;
        const remaining = Math.max(0, slot.maxTokens - bookedCount);

        return {
            ...slot,
            bookedCount,
            remaining,
            isFullyBooked: remaining === 0,
            available: remaining > 0
        };
    });

    console.log(
        `Available slots fetched | Dept: ${deptId} | Service: ${serviceId} | Date: ${date}`
    );

    return res.status(200).json(
        new ApiResponse(200, results, "Available slots fetched successfully")
    );
});

















// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
    console.log("createBooking called with body:", req.body);
    const { deptId, serviceId } = req.params;
    const {
        date,
        slotTime,
        priorityType = "NONE",
        notes
    } = req.body;

    /* ─────────────────── VALIDATIONS ─────────────────── */

    if (!date || !slotTime) {
        throw new ApiError(400, "Date and slotTime are required");
    }

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found in this department");

    if (!department.isSlotBookingEnabled) {
        throw new ApiError(400, "Online booking is not enabled for this department");
    }

    /* ───────────── BOOKING WINDOW CHECK ───────────── */

    if (!isDateWithinBookingWindow(date, department.bookingWindowDays || 7)) {
        throw new ApiError(
            400,
            `Selected date must be within ${department.bookingWindowDays || 7} days from today`
        );
    }

    /* ───────────── WORKING DAY CHECK ───────────── */

    const selectedDate = dayjs(date).tz(TZ);
    const dayOfWeek = selectedDate.format("ddd");

    const workingDay = department.workingHours.find(
        d => d.day === dayOfWeek
    );

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    /* ───────────── SLOT VALIDATION ───────────── */

    const [slotStart, slotEnd] = slotTime.split("-");

    if (!isSlotWithinWorkingHours({ start: slotStart, end: slotEnd }, workingDay)) {
        throw new ApiError(400, "Selected slot is outside working hours");
    }

    /* ───────────── CAPACITY CHECK ───────────── */

    const tokenManagement =
        service.tokenManagement || department.tokenManagement || {};

    let maxTokens = tokenManagement.maxTokensPerSlot || 10;

    if (tokenManagement.slotWindows?.length) {
        const window = tokenManagement.slotWindows.find(
            w => w.start === slotStart && w.end === slotEnd
        );
        if (window) {
            maxTokens = window.maxTokens || maxTokens;
        }
    }

    const totalBooked = await Booking.countDocuments({
        department: deptId,
        "service.serviceId": serviceId,
        date,
        slotTime,
        status: { $nin: ["CANCELLED", "REJECTED"] }
    });


    if (totalBooked >= maxTokens) {
        throw new ApiError(400, "Selected slot is fully booked");
    }

    /* ───────────── PRIORITY VALIDATION ───────────── */

    if (priorityType !== "NONE") {
        if (!service.priorityAllowed) {
            throw new ApiError(400, "Priority service is not allowed for this service");
        }

        const criteria = department.priorityCriteria || {};

        switch (priorityType) {
            case "SENIOR_CITIZEN":
                if (!criteria.seniorCitizenAge) {
                    throw new ApiError(400, "Senior citizen priority not enabled");
                }
                break;

            case "PREGNANT_WOMEN":
                if (!criteria.allowPregnantWomen) {
                    throw new ApiError(400, "Pregnant women priority not enabled");
                }
                break;

            case "DIFFERENTLY_ABLED":
                if (!criteria.allowDifferentlyAbled) {
                    throw new ApiError(400, "Differently abled priority not enabled");
                }
                break;

            default:
                throw new ApiError(400, "Invalid priority type");
        }
    }

    /* ───────────── PREFILL SUBMITTED DOCS ───────────── */

    const submittedDocs = service.requiredDocs.map(doc => ({
        requiredDocId: doc._id,

        name: doc.name,
        description: doc.description || "",

        documentUrl: null,
        uploadedAt: null,

        status: "NOT_UPLOADED",
        rejectionReason: ""
    }));


    /* ───────────── INITIAL STATUS ───────────── */

    const initialStatus = service.isDocumentUploadRequired
        ? "PENDING_DOCS"
        : "DOCS_SUBMITTED";

    /* ───────────── CREATE BOOKING ───────────── */

    const booking = await Booking.create({
        user: req.user._id,
        userName: req.user.name,
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
            maxTokens
        },

        submittedDocs,
        status: initialStatus,
        priorityType,
        estimatedServiceTime: tokenManagement.timeBtwEverySlot || 15,
        additionalNotes: notes || "",

        metadata: {
            queueType: tokenManagement.queueType || "Hybrid",
            isDocumentUploadRequired: service.isDocumentUploadRequired,
            departmentName: department.name,
            serviceRequiresDocs: service.isDocumentUploadRequired
        }
    });

    console.log(
        `✅ Booking created | ID: ${booking._id} | User: ${req.user._id}`
    );

    return res.status(201).json(
        new ApiResponse(201, booking, "Booking created successfully")
    );
});



















// Get user's bookings
const getUserBookings = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
        .sort({ date: 1, slotTime: 1 })
        .select(`
            date
            slotTime
            status
            service
            metadata.departmentName
            metadata.serviceRequiresDocs
        `)
        .lean();

    console.log(
        `User bookings fetched | User: ${userId} | Count: ${bookings.length}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            bookings.length ? "User bookings fetched successfully" : "No bookings found"
        )
    );
});
















// Get booking by ID
const getBookingById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "department",
            select: "name address contact services"
        })
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // 🔒 Security check
    if (booking.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this booking");
    }

    // 🔍 Find service config from department
    const serviceFromDept = booking.department.services.find(
        s => s._id.toString() === booking.service.serviceId.toString()
    );

    if (!serviceFromDept) {
        throw new ApiError(500, "Service configuration not found for this booking");
    }

    /**
     * 🧠 Merge required docs + submitted docs
     * This array WILL BE booking.submittedDocs
     * Frontend already expects this
     */
    const mergedDocs = serviceFromDept.requiredDocs.map(reqDoc => {
        const submitted = booking.submittedDocs.find(
            d => d.name === reqDoc.name
        );

        return {
            _id: reqDoc._id,               // ✅ frontend uses this as docId
            name: reqDoc.name,
            description: reqDoc.description,
            isMandatory: reqDoc.isMandatory,

            documentUrl: submitted?.documentUrl || null,
            uploadedAt: submitted?.uploadedAt || null,
            status: submitted?.status || "NOT_UPLOADED",
            rejectionReason: submitted?.rejectionReason || ""
        };
    });

    const response = {
        _id: booking._id,
        date: booking.date,
        slotTime: booking.slotTime,
        status: booking.status,
        priorityType: booking.priorityType,
        estimatedServiceTime: booking.estimatedServiceTime,
        notes: booking.additionalNotes || "",

        department: {
            name: booking.department.name,
            address: booking.department.address,
            contact: booking.department.contact
        },

        service: booking.service,

        // ✅ THIS IS WHAT FIXES THE UI
        submittedDocs: mergedDocs,

        metadata: booking.metadata,
        createdAt: booking.createdAt
    };

    console.log(
        `Booking details fetched | Booking: ${bookingId} | User: ${req.user._id}`
    );

    return res.status(200).json(
        new ApiResponse(200, response, "Booking fetched successfully")
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