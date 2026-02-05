import fs from "fs";
import { Booking } from "../models/booking.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryFile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// utils/cloudinaryHelpers.js
/**
 * 🧩 Extract Cloudinary public_id from a Cloudinary URL
 * - Handles versioned URLs (v12345)
 * - Removes file extension
 */
export const extractPublicId = (url) => {
    if (!url) return null;

    // Example:
    // https://res.cloudinary.com/.../upload/v1766390157/queueindia/bookings/xxx.jpg
    const parts = url.split("/upload/")[1];
    if (!parts) return null;

    // Remove version (v12345/)
    const withoutVersion = parts.replace(/^v\d+\//, "");

    // Remove extension (.jpg, .png, .pdf)
    return withoutVersion.replace(/\.[^/.]+$/, "");
};


const uploadDocument = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { docId } = req.body;
    // console.log("📥 uploadDocument called");
    // console.log("bookingId:", bookingId);
    // console.log("docId (requiredDocId):", docId);
    // console.log("file:", req.file?.originalname);

    /* ───────────── VALIDATIONS ───────────── */

    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    if (!docId) {
        throw new ApiError(400, "docId (requiredDocId) is required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // 🔒 Ownership check
    if (booking.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to upload documents for this booking");
    }

    // ❌ Block invalid states
    if (!["PENDING_DOCS", "DOCS_SUBMITTED","UNDER_REVIEW"].includes(booking.status)) {
        throw new ApiError(
            400,
            `Cannot upload documents in ${booking.status} state`
        );
    }

    // find document by requiredDocId

    const doc = booking.submittedDocs.find(
        d => d.requiredDocId.toString() === docId
    );

    if (!doc) {
        throw new ApiError(400, "Invalid document reference");
    }

    // update existing document
    if (doc.documentUrl) {
        try {
            const publicId = extractPublicId(doc.documentUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        } catch (err) {
            console.error("⚠️ Failed to delete old file:", err.message);
        }
    }

    // upload new file

    const uploadedDoc = await uploadToCloudinary(
        req.file.path,
        `queueindia/bookings/${bookingId}`
    );


    doc.documentUrl = uploadedDoc.url;
    doc.uploadedAt = new Date();
    doc.status = "PENDING";
    doc.rejectionReason = "";

    // update booking status based on all documents
    const allUploaded = booking.submittedDocs.every(
        d => Boolean(d.documentUrl)
    );

    booking.status = allUploaded
        ? "DOCS_SUBMITTED"
        : "PENDING_DOCS";

    await booking.save();


    if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("🧹 Temp file deleted:", req.file.path);
    }


    const responseBooking = {
        ...booking.toObject(),
        documents: {
            required: booking.submittedDocs,
            submittedCount: booking.submittedDocs.length
        }
    };

    console.log(`Document uploaded for bookingId: ${bookingId}, docId: ${docId}`);

    return res.status(200).json(
        new ApiResponse(200, responseBooking, "Document uploaded successfully")
    );
});

export { uploadDocument };