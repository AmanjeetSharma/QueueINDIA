import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ServiceToken from "../models/serviceToken.model.js";
import Department from "../models/department.model.js";
import Booking from "../models/booking.model.js";





const getLiveQueue = asyncHandler(async (req, res) => {
    const { serviceId, date, departmentId: queryDeptId } = req.query;

    /* ───────────── BASIC VALIDATIONS ───────────── */

    if (!date) {
        throw new ApiError(400, "date query parameter is required");
    }

    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new ApiError(400, "Valid serviceId is required");
    }

    /* ───────────── DEPARTMENT RESOLUTION ───────────── */

    let departmentId;

    if (req.user.role === "SUPER_ADMIN") {
        if (!queryDeptId || !mongoose.Types.ObjectId.isValid(queryDeptId)) {
            throw new ApiError(400, "Valid departmentId is required for SUPER_ADMIN");
        }
        departmentId = queryDeptId;
    } else {
        if (!req.user.departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }
        departmentId = req.user.departmentId;
    }

    /* ───────────── BASE FILTER ───────────── */

    const baseFilter = {
        department: departmentId,
        service: serviceId,
        date
    };

    /* ───────────── CURRENTLY SERVING ───────────── */

    // 🔥 CHANGED: find() instead of findOne() to support multiple officers
    const serving = await ServiceToken.find({
        ...baseFilter,
        status: "SERVING"
    })
        // 🔥 FIXED: removed comma inside select
        .select("tokenNumber priorityType priorityRank status servedBy servedByName userName slotTime booking")
        .lean();

    /* ───────────── WAITING QUEUE ───────────── */

    const waiting = await ServiceToken.find({
        ...baseFilter,
        status: "WAITING"
    })
        .sort({
            priorityRank: -1,
            tokenNumber: 1
        })
        .select("tokenNumber priorityType priorityRank status userName slotTime booking")
        .lean();

    // 🔥 FIXED: safe optional chaining to avoid null crash
    console.log(
        `Live Queue fetched | date: ${date} | serving: ${serving?.length || 0} | waiting: ${waiting?.length || 0}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId,
                serviceId,
                date,

                // 🔥 NEW: always return arrays (never null)
                serving: serving || [],
                totalServing: serving?.length || 0,

                waiting: waiting || [],
                totalWaiting: waiting?.length || 0
            },
            "Live queue fetched successfully"
        )
    );
});











const recallSkippedTokens = asyncHandler(async (req, res) => {
    const { serviceId, date } = req.body;

    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new ApiError(400, "Valid serviceId is required");
    }

    if (!date) {
        throw new ApiError(400, "date is required");
    }

    const departmentId =
        req.user.role === "SUPER_ADMIN"
            ? req.body.departmentId
            : req.user.departmentId;

    if (!departmentId) {
        throw new ApiError(400, "Department not resolved");
    }

    const result = await ServiceToken.updateMany(
        {
            department: departmentId,
            service: serviceId,
            date,
            status: "SKIPPED"
        },
        {
            $set: { status: "WAITING" }
        }
    );

    console.log(`Tokens recalled: ${result.modifiedCount} | Service: ${serviceId} | Date: ${date}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                recalledCount: result.modifiedCount
            },
            "Skipped tokens have been respawned into waiting queue"
        )
    );
})













const serveNextToken = asyncHandler(async (req, res) => {
    const { serviceId, date } = req.body;

    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new ApiError(400, "Valid serviceId is required");
    }

    if (!date) {
        throw new ApiError(400, "date is required");
    }

    // Resolve department
    const departmentId =
        req.user.role === "SUPER_ADMIN"
            ? req.body.departmentId
            : req.user.departmentId;

    if (!departmentId || !mongoose.Types.ObjectId.isValid(departmentId)) {
        throw new ApiError(400, "Department not found");
    }

    /* ───────────── ENSURE SINGLE SERVING TOKEN ───────────── */

    const alreadyServing = await ServiceToken.findOne({
        servedBy: req.user._id,
        status: "SERVING"
    }).lean();

    if (alreadyServing) {
        throw new ApiError(
            409,
            "A token is already being served. Complete or skip it first."
        );
    }

    /* ───────────── PICK NEXT TOKEN (PRIORITY + FIFO) ───────────── */

    const nextToken = await ServiceToken.findOneAndUpdate(
        {
            department: departmentId,
            service: serviceId,
            date,
            status: "WAITING"
        },
        {
            $set: {
                status: "SERVING",
                servedBy: req.user._id,
                servedAt: new Date(),
                servedByName: req.user.name
            }
        },
        {
            sort: {
                priorityRank: -1, // higher priority first
                tokenNumber: 1     // FIFO inside same priority
            },
            new: true
        }
    );

    if (!nextToken) {
        throw new ApiError(404, "No waiting tokens in queue");
    }

    console.log(
        `[QUEUE] SERVING NEXT | Token: ${nextToken.tokenNumber} | Service: ${serviceId} | Date: ${date}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            nextToken,
            "Next token is now being served"
        )
    );
});









/* =========================================================
   COMPLETE TOKEN
   ========================================================= */

const completeToken = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tokenId)) {
        throw new ApiError(400, "Invalid token ID");
    }

    const token = await ServiceToken.findById(tokenId);

    if (!token) {
        throw new ApiError(404, "Service token not found");
    }

    /* ───────────── DEPARTMENT PROTECTION ───────────── */

    if (req.user.role !== "SUPER_ADMIN") {
        if (!req.user.departmentId) {
            throw new ApiError(400, "You are not assigned to any department | Access denied!");
        }

        if (token.department.toString() !== req.user.departmentId.toString()) {
            throw new ApiError(403, "This token does not belong to your department | Access denied!");
        }
    }

    /* ───────────── NEW: SAFE SERVED BY VALIDATION ───────────── */
    // prevents crash if servedBy is null
    if (!token.servedBy || token.servedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not serving this token");
    }

    if (token.status !== "SERVING") {
        throw new ApiError(400, "Only SERVING token can be completed");
    }

    /* ───────────── CHANGED: ATOMIC UPDATE TO PREVENT RACE CONDITIONS ───────────── */

    const updatedToken = await ServiceToken.findOneAndUpdate(
        {
            _id: tokenId,
            status: "SERVING",
            servedBy: req.user._id
        },
        {
            status: "COMPLETED",
            completedAt: new Date()
        },
        { new: true }
    );

    if (!updatedToken) {
        throw new ApiError(409, "Token could not be completed. It may have already been updated.");
    }

    /* ───────────── BOOKING STATUS UPDATE ───────────── */

    await Booking.findByIdAndUpdate(updatedToken.booking, {
        status: "COMPLETED"
    });

    console.log(
        `Token completed: ${updatedToken._id} | Token Number: ${updatedToken.tokenNumber} | Date: ${updatedToken.date}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Booking token marked as completed"
        )
    );
});











/* =========================================================
   SKIP TOKEN
   ========================================================= */

const skipToken = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tokenId)) {
        throw new ApiError(400, "Invalid token ID");
    }

    const token = await ServiceToken.findById(tokenId);

    if (!token) {
        throw new ApiError(404, "Service token not found");
    }

    /* ───────────── DEPARTMENT PROTECTION ───────────── */

    if (req.user.role !== "SUPER_ADMIN") {
        if (!req.user.departmentId) {
            throw new ApiError(400, "User not assigned to any department");
        }

        if (token.department.toString() !== req.user.departmentId.toString()) {
            throw new ApiError(403, "Access denied");
        }
    }

    /* ───────────── NEW: SAFE SERVED BY VALIDATION ───────────── */

    if (!token.servedBy || token.servedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not serving this token");
    }

    if (token.status !== "SERVING") {
        throw new ApiError(400, "Only SERVING token can be skipped");
    }

    /* ───────────── CHANGED: ATOMIC UPDATE ───────────── */

    const updatedToken = await ServiceToken.findOneAndUpdate(
        {
            _id: tokenId,
            status: "SERVING",
            servedBy: req.user._id
        },
        {
            status: "SKIPPED"
        },
        { new: true }
    );

    if (!updatedToken) {
        throw new ApiError(409, "Token could not be skipped. It may have already been updated.");
    }

    console.log(
        `Token skipped: ${updatedToken._id} | Token Number: ${updatedToken.tokenNumber}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Token skipped"
        )
    );
});












const getQueueStats = asyncHandler(async (req, res) => {
    const { serviceId, date, departmentId: queryDeptId } = req.query;

    // Department resolution (same as getLiveQueue)
    let departmentId;
    if (req.user.role === "SUPER_ADMIN") {
        if (!queryDeptId || !mongoose.Types.ObjectId.isValid(queryDeptId)) {
            throw new ApiError(400, "Valid departmentId is required for SUPER_ADMIN");
        }
        departmentId = queryDeptId;
    } else {
        if (!req.user.departmentId) {
            throw new ApiError(400, "User is not assigned to any department");
        }
        departmentId = req.user.departmentId;
    }

    const baseFilter = {
        department: departmentId,
        date: date || new Date().toISOString().split('T')[0]
    };

    if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
        baseFilter.service = serviceId;
    }

    // Get today's statistics
    const stats = await ServiceToken.aggregate([
        {
            $match: baseFilter
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                avgWaitTime: {
                    $avg: {
                        $subtract: ["$servedAt", "$createdAt"]
                    }
                }
            }
        }
    ]);

    // Format the response
    const formattedStats = {
        departmentId,
        serviceId: serviceId || null,
        date: baseFilter.date,
        todayServed: stats.find(s => s._id === "COMPLETED")?.count || 0,
        todayPending: stats.find(s => s._id === "WAITING")?.count || 0,
        todaySkipped: stats.find(s => s._id === "SKIPPED")?.count || 0,
        avgWaitTime: stats.find(s => s._id === "COMPLETED")?.avgWaitTime || 0
    };

    console.log("Queue statistics fetched for service:", {
        departmentId,
        serviceId: serviceId || null,
        date: baseFilter.date,
        stats: formattedStats
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            formattedStats,
            "Queue statistics fetched successfully"
        )
    );
});












const getDepartmentServicesForQueue = asyncHandler(async (req, res) => {
    // Resolve department
    const departmentId =
        req.user.role === "SUPER_ADMIN"
            ? req.query.departmentId
            : req.user.departmentId;

    if (!departmentId) {
        throw new ApiError(400, "Department not found");
    }

    const department = await Department.findById(departmentId)
        .select("services name")
        .lean();

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    // Filter only active / queue-enabled services (optional future-proofing)
    const services = department.services.map(service => ({
        _id: service._id,
        name: service.name,
        serviceCode: service.serviceCode,
        priorityAllowed: service.priorityAllowed ?? false,
        isDocumentUploadRequired: service.isDocumentUploadRequired ?? true
    }));

    console.log(`Fetched ${services.length} services for department ${department.name} (${departmentId}) for queue-services`);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId,
                departmentName: department.name,
                services
            },
            "Department services fetched successfully"
        )
    );
});













export {
    getLiveQueue,
    recallSkippedTokens,
    serveNextToken,
    completeToken,
    skipToken,
    getQueueStats,
    getDepartmentServicesForQueue,
};