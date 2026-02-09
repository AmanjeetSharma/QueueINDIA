import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { ServiceToken } from "../models/serviceToken.model.js";












const getDepartmentBookings = asyncHandler(async (req, res) => {
    let filter = {};

    // Role-based department logic
    if (req.user.role === "SUPER_ADMIN") {
        // Super admin can view all departments
        if (req.query.departmentId) {
            filter.department = req.query.departmentId;
        }
    } else {
        // Officer/Admin must belong to a department
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        filter.department = departmentId;
    }

    // Pagination
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 50);
    const skip = (page - 1) * limit;

    // Additional filters
    const { status, date, serviceId } = req.query;

    if (status) filter.status = status;
    if (date) filter.date = date;
    if (serviceId) filter["service.serviceId"] = serviceId;

    // Fetch bookings + total count
    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select(
                "_id userName service.name date slotTime status priorityType tokenNumber createdAt"
            )
            .lean(),
        Booking.countDocuments(filter)
    ]);

    console.log(
        `[DEPT] Bookings fetched: ${bookings.length} | Total: ${total} | Page: ${page} | Limit: ${limit} | Role: ${req.user.role}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookings,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            },
            "Department bookings fetched successfully"
        )
    );
});














const getBookingDetailsForOfficer = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Role-based department check
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied to this booking");
        }
    }

    // Auto-move to UNDER_REVIEW on first open
    if (booking.status === "DOCS_SUBMITTED") {
        booking.status = "UNDER_REVIEW";
        await booking.save();
    }

    console.log(`[DEPT] Booking details fetched for ID: ${bookingId} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking details fetched successfully"
        )
    );
});









const PRIORITY_RANK_MAP = {
    NONE: 0,
    SENIOR_CITIZEN: 1,
    PREGNANT_WOMEN: 2,
    DIFFERENTLY_ABLED: 3
};


const approveBooking = asyncHandler(async (req, res) => {
    const { bookingId, docId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // ───── Role-based department security ─────
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied");
        }
    }

    // ───── Approve single document ─────
    const doc = booking.submittedDocs.id(docId);

    if (!doc) {
        throw new ApiError(404, "Document not found");
    }

    if (doc.status === "APPROVED") {
        throw new ApiError(400, "Document already approved");
    }

    doc.status = "APPROVED";
    doc.rejectionReason = "";

    // ───── Check if all docs are approved ─────
    const allDocsApproved = booking.submittedDocs.every(
        d => d.status === "APPROVED"
    );

    // If not all approved → just save & return
    if (!allDocsApproved) {
        booking.status = "UNDER_REVIEW";
        await booking.save();

        return res.status(200).json(
            new ApiResponse(200, null, "Document approved")
        );
    }

    // ───── All docs approved → assign token ─────
    if (booking.status === "APPROVED") {
        throw new ApiError(400, "Booking already approved");
    }

    // Find last token for same department + date + slot
    const lastToken = await ServiceToken.findOne({
        department: booking.department,
        date: booking.date,
        slotTime: booking.slotTime
    }).sort({ tokenNumber: -1 });

    const nextTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const priorityType = booking.priorityType || "NONE";
    const priorityRank = PRIORITY_RANK_MAP[priorityType] ?? 0;

    const serviceToken = await ServiceToken.create({
        booking: booking._id,
        department: booking.department,
        service: booking.service.serviceId,
        date: booking.date,
        slotTime: booking.slotTime,
        tokenNumber: nextTokenNumber,
        priorityType,
        priorityRank
    });

    booking.status = "APPROVED";
    await booking.save();

    console.log(
        `[DEPT] Booking approved | BookingId: ${bookingId} | Token: ${nextTokenNumber} | Priority: ${priorityType}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookingId: booking._id,
                tokenNumber: nextTokenNumber,
                priorityRank,
                serviceTokenId: serviceToken._id
            },
            "Booking approved and token has been assigned"
        )
    );
});











const rejectDocument = asyncHandler(async (req, res) => {
    const { bookingId, docId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // SUPER_ADMIN bypass
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied");
        }
    }

    const doc = booking.submittedDocs.id(docId);

    if (!doc) {
        throw new ApiError(404, "Document not found");
    }

    // Prevent repeated rejection
    if (doc.status === "REJECTED") {
        throw new ApiError(
            400,
            "Document already rejected. Wait for user to re-upload."
        );
    }

    // Reject only the document
    doc.status = "REJECTED";
    doc.rejectionReason = reason || "Rejected by officer";

    // Booking remains under review
    booking.status = "UNDER_REVIEW";

    await booking.save();

    console.log(`[DEPT] Document rejected for booking ID: ${bookingId} | By user: ${req.user._id} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Document rejected. User must re-upload."
        )
    );
});
















const rejectBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // SUPER_ADMIN bypass
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied");
        }
    }

    // Prevent invalid transitions
    if (booking.status === "COMPLETED") {
        throw new ApiError(400, "Completed booking cannot be rejected");
    }

    if (booking.status === "CANCELLED") {
        throw new ApiError(400, "Cancelled booking cannot be rejected");
    }

    if (booking.status === "REJECTED") {
        throw new ApiError(400, "Booking already rejected");
    }

    // Reject booking
    booking.status = "REJECTED";
    booking.bookingRejectionReason =
        reason || "Booking rejected by officer";

    // Optional: reject all documents for consistency
    booking.submittedDocs.forEach((doc) => {
        doc.status = "REJECTED";
        doc.rejectionReason = reason || "Booking rejected";
    });

    await booking.save();

    console.log(`[DEPT] Booking rejected for ID: ${bookingId} | By user: ${req.user._id} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Booking rejected successfully"
        )
    );
});















const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // SUPER_ADMIN bypass
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied to this booking");
        }
    }

    if (booking.status === "COMPLETED") {
        throw new ApiError(400, "Completed bookings cannot be cancelled");
    }

    booking.status = "CANCELLED";
    await booking.save();

    // Optional: update token status if exists
    await ServiceToken.findOneAndUpdate(
        { booking: booking._id },
        { status: "SKIPPED" }
    );

    console.log(`[DEPT] Booking cancelled for ID: ${bookingId} | By user: ${req.user._id} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(200, null, "Booking cancelled successfully")
    );
});













const completeBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // SUPER_ADMIN bypass
    if (req.user.role !== "SUPER_ADMIN") {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }

        if (booking.department.toString() !== departmentId.toString()) {
            throw new ApiError(403, "Access denied to this booking");
        }
    }

    if (booking.status !== "APPROVED") {
        throw new ApiError(400, "Only approved bookings can be completed");
    }

    booking.status = "COMPLETED";
    await booking.save();

    // Update token status
    await ServiceToken.findOneAndUpdate(
        { booking: booking._id },
        { status: "COMPLETED" }
    );

    console.log(`[DEPT] Booking marked as completed for ID: ${bookingId} | By user: ${req.user._id} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(200, null, "Booking marked as completed")
    );
});










const evaluateBookingAfterDocChange = async (booking) => {
    const hasRejected = booking.submittedDocs.some(
        (doc) => doc.status === "REJECTED"
    );

    const allApproved = booking.submittedDocs.every(
        (doc) => doc.status === "APPROVED"
    );

    if (hasRejected) {
        booking.status = "REJECTED";
        await booking.save();
        return { approved: false };
    }

    if (allApproved) {
        // Assign token
        const lastToken = await ServiceToken.findOne({
            department: booking.department,
            date: booking.date,
            slotTime: booking.slotTime
        }).sort({ tokenNumber: -1 });

        const nextTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        const serviceToken = await ServiceToken.create({
            booking: booking._id,
            department: booking.department,
            service: booking.service.serviceId,
            date: booking.date,
            slotTime: booking.slotTime,
            tokenNumber: nextTokenNumber
        });

        booking.status = "APPROVED";
        booking.tokenNumber = nextTokenNumber;
        await booking.save();

        return {
            approved: true,
            tokenNumber: nextTokenNumber,
            serviceTokenId: serviceToken._id
        };
    }

    // Still under review
    booking.status = "UNDER_REVIEW";
    await booking.save();

    return { approved: false };
};









export {
    getDepartmentBookings,
    getBookingDetailsForOfficer,
    approveBooking,
    completeBooking,
    cancelBooking,
    rejectDocument,
    rejectBooking
};
