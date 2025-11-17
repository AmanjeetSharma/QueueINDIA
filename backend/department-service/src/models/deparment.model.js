import mongoose, { Schema } from "mongoose";



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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true
        }
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
        openTime: { type: String, required: true }, // "10:00"
        closeTime: { type: String, required: true }, // "17:00"
        isClosed: { type: Boolean, default: false },
    },
    { _id: false }
);








// Service Schema
const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        serviceCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
        },
        avgServiceTime: {
            type: Number,
            default: 15 // mins
        }
    },
    { _id: false }
);











const tokenManagementSchema = new Schema(
    {
        slotInterval: {
            type: Number,
            default: 15
        }, // minutes per slot
        maxDailyTokens: {
            type: Number,
            default: 100
        },
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid"
        },
        maxTokensPerSlot: {
            type: Number,
            default: 10,
            // ➜ Number of people allowed to book the same time slot.
            //    Useful when multiple counters support the same service.
        },
        allowPriorityTokens: {
            type: Boolean,
            default: true,
            // ➜ Enable separate queue for senior citizens,
            //    differently-abled, pregnant women etc.
        },
        priorityPercentage: {
            type: Number,
            default: 10,
            // ➜ % of total daily tokens reserved for priority users.
        },
        autoStopOnOverload: {
            type: Boolean,
            default: true,
            // ➜ Automatically stops token generation when overloaded
            //    or long wait-time detected.
        },
    },
    { _id: false }
);












const departmentSchema = new Schema(
    {
        // 🔹 Basic Info
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

        // 🔹 Location
        address: addressSchema,

        // 🔹 Contacts
        contact: {
            phone: { type: String, trim: true },
            email: { type: String, trim: true },
            website: { type: String, trim: true }
        },

        // 🔹 Operational Info
        workingHours: [workingHoursSchema],
        services: [serviceSchema],
        tokenManagement: tokenManagementSchema,


        // 🔹 Permission & Ownership
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true // Department Admin
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true // Super Admin
        },

        // 🔹 Status
        status: {
            type: String,
            enum: ["active", "inactive", "under-maintenance"],
            default: "active"
        },
        isSlotBookingEnabled: { type: Boolean, default: true },
        isDocumentUploadRequired: { type: Boolean, default: true },


        // 🔹 Ratings
        ratings: [ratingSchema],

    },
    { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
