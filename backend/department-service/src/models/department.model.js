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




















// Token Management Schema (Embed inside Department)
const tokenManagementSchema = new Schema(
    {
        maxDailyServiceTokens: { type: Number, default: null },
        maxTokensPerSlot: { type: Number, default: 10 },
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid"
        },

        timeBtwEverySlot: { type: Number, default: 15 },

        slotStartTime: { type: String, default: "10:00" },
        slotEndTime: { type: String, default: "17:00" },

        slotWindows: [
            {
                start: { type: String, required: true }, // "10:00"
                end: { type: String, required: true },   // "12:00"
                maxTokens: { type: Number, required: true, default: 10 }
            }
        ],
    },
    { _id: false }
);








// Service Schema
const serviceSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        serviceCode: { type: String, required: true, uppercase: true, trim: true },
        description: { type: String, trim: true },
        priorityAllowed: { type: Boolean, default: true },
        isDocumentUploadRequired: { type: Boolean, default: true },

        tokenManagement: tokenManagementSchema,
        requiredDocs: [documentRequirementSchema],

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
        workingHours: [{ type: workingHoursSchema, default: [] }],
        services: [{ type: serviceSchema, default: [] }],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true // Super Admin
        },

        status: {
            type: String,
            enum: ["active", "inactive", "under-maintenance"],
            default: "active"
        },

        isSlotBookingEnabled: { type: Boolean, default: true },
        bookingWindowDays: { type: Number, default: 7, min: 1, max: 30 },

        priorityCriteria: {
            seniorCitizenAge: { type: Number, default: 60 },
            allowPregnantWomen: { type: Boolean, default: true },
            allowDifferentlyAbled: { type: Boolean, default: true }
        },

        ratings: [{ type: ratingSchema, default: [] }],

        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true, // Department Admin,
                default: []
            },
        ],
    },
    { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
