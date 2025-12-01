import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        service: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        date: {
            type: String, // "2025-11-21"
            required: true
        },

        slotTime: {
            type: String, // "10:00-10:15"
            required: true
        },

        submittedDocs: [
            {
                name: String,
                url: String,
                isApproved: { type: Boolean, default: false }
            }
        ],

        status: {
            type: String,
            enum: ["PENDING_DOCS", "UNDER_REVIEW", "APPROVED", "REJECTED"],
            default: "PENDING_DOCS"
        },

        priority: {
            type: Boolean,
            default: false
        },

        tokenNumber: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
