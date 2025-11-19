import mongoose, { Schema } from "mongoose";
// import tokenManagementSchema from "./tokenManagementSchema.model.js";




// Token Management Schema (Embed inside Department)
const tokenManagementSchema = new Schema(
    {
        // Token & Slot Logic
        slotInterval: {
            type: Number,
            default: 15,
            min: 5,
            // ➜ Time between two tokens in minutes
        },
        maxDailyTokens: {
            type: Number,
            default: 300,
            min: 50,
            // ➜ Total number of tokens department can handle daily
        },
        maxTokensPerSlot: {
            type: Number,
            default: 10,
            min: 1,
            // ➜ Supports multiple counters per slot
        },
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid",
            // ➜ Token generation mode: App / Counter / Both
        },

        // Operating Time Controls
        slotStartTime: {
            type: String,
            default: "10:00",
            // ➜ Token issue timing start
        },
        slotEndTime: {
            type: String,
            default: "17:00",
            // ➜ Token issue timing end
        },
        bookingWindowDays: {
            type: Number,
            default: 7,
            min: 1,
            max: 30,
            // ➜ User can book a token X days in advance
        },

        // Priority Queue System
        allowPriorityTokens: {
            type: Boolean,
            default: true,
            // ➜ for Senior Citizens, Differently-Abled, Pregnant women
        },
        priorityPercentage: {
            type: Number,
            default: 10,
            min: 0,
            max: 50,
            // ➜ % reserved tokens for priority users
        },
        priorityCriteria: {
            seniorCitizenAge: {
                type: Number,
                default: 60,
                // ➜ Age >= 60 auto qualifies as priority
            },
            allowPregnantWomen: {
                type: Boolean,
                default: true
            },
            allowDifferentlyAbled: {
                type: Boolean,
                default: true
            }
        },

        // Smart Queue Protection
        autoStopOnOverload: {
            type: Boolean,
            default: true,
            // ➜ When queue crosses safe wait time, stop token creation
        },
        realtimeWaitEstimation: {
            type: Boolean,
            default: true,
            // ➜ Shows live ETA to users
        },

        // Tracking Tokens Issued (Runtime)
        issuedTokenCount: {
            type: Number,
            default: 0,
            // ➜ Helps calculate remaining tokens & crowd
        },
    },
    { _id: false }
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
