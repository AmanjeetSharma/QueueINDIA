import mongoose from "mongoose";

const serviceTokenSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    slotTime: {
        type: String,
        required: true
    },

    tokenNumber: {
        type: Number,
        required: true
    },
    priorityType: {
        type: String,
        enum: ["NONE", "SENIOR_CITIZEN", "PREGNANT_WOMEN", "DIFFERENTLY_ABLED"],
        default: "NONE"
    },
    priorityRank: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ["WAITING", "SERVING", "COMPLETED", "SKIPPED"],
        default: "WAITING"
    },

    completedAt: Date,

}, { timestamps: true });

serviceTokenSchema.index(
    { department: 1, date: 1, slotTime: 1, tokenNumber: 1 },
    { unique: true }
);

export const ServiceToken = mongoose.model("ServiceToken", serviceTokenSchema);
