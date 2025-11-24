import mongoose, { Schema } from "mongoose";
// import tokenManagementSchema from "./tokenManagementSchema.model.js";




// Token Management Schema (Embed inside Department)
const tokenManagementSchema = new Schema(
    {
        slotInterval: { type: Number, default: 15 },
        maxDailyTokens: { type: Number, default: 300 },
        maxTokensPerSlot: { type: Number, default: 10 },
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid"
        },

        slotStartTime: { type: String, default: "10:00" },
        slotEndTime: { type: String, default: "17:00" },
        bookingWindowDays: { type: Number, default: 7 },

        allowPriorityTokens: { type: Boolean, default: true },
        priorityPercentage: { type: Number, default: 10 },
        priorityCriteria: {
            seniorCitizenAge: { type: Number, default: 60 },
            allowPregnantWomen: { type: Boolean, default: true },
            allowDifferentlyAbled: { type: Boolean, default: true }
        },

        autoStopOnOverload: { type: Boolean, default: true },
        realtimeWaitEstimation: { type: Boolean, default: true },

        issuedTokenCount: { type: Number, default: 0 }
    },
    { _id: false }
);



// Counter Schema (Embed inside Department)
const counterSchema = new Schema(
    {
        counterNumber: { type: Number, required: true },
        assignedServiceCodes: [String], // Which services supported here
        isActive: { type: Boolean, default: true }
    },
    { _id: true }
);







const addressSchema = new Schema(
    {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        district: { type: String, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true, index: true },
        // Country always India — no need to store
    },
    { _id: false }
);


// Rating Schema (per user review)
const ratingSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true }
    },
    { timestamps: true, _id: false }
);









// Operating Hours Schema (each day)
const workingHoursSchema = new Schema(
    {
        day: {
            type: String,
            enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            required: true
        },
        isClosed: {
            type: Boolean,
            default: false
        },
        openTime: {
            type: String,
            required: function () {
                return !this.isClosed;
            }
        },
        closeTime: {
            type: String,
            required: function () {
                return !this.isClosed;
            }
        }
    },
    { _id: false }
);






const documentRequirementSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        isMandatory: { type: Boolean, default: true }
    },
    { _id: true }
);




// Service Schema
const serviceSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        serviceCode: { type: String, required: true, uppercase: true, trim: true },
        description: { type: String, trim: true },
        avgServiceTime: { type: Number, default: 15 },

        requiredDocs: [documentRequirementSchema],

        maxDailyServiceTokens: { type: Number, default: null },
        counters: [Number],
        priorityAllowed: { type: Boolean, default: true },
    },
    { _id: true }
);









const departmentSchema = new Schema(
    {
        // Basic Info
        departmentCategory: {
            type: String,
            required: true, // user enters manually (Super Admin can later classify)
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        // Location
        address: addressSchema,

        // Contacts
        contact: {
            phone: { type: String, trim: true },
            email: { type: String, trim: true },
            website: { type: String, trim: true }
        },

        // Operational Info
        workingHours: [workingHoursSchema],
        services: [serviceSchema],
        tokenManagement: tokenManagementSchema,
        counters: [counterSchema],


        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true // Super Admin
        },

        // Status
        status: {
            type: String,
            enum: ["active", "inactive", "under-maintenance"],
            default: "active"
        },
        isSlotBookingEnabled: { type: Boolean, default: true },
        isDocumentUploadRequired: { type: Boolean, default: true },


        // 🔹 Ratings
        ratings: [ratingSchema],

        // Permission & Ownership
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true // Department Admin
            },
        ],
    },
    { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
