import mongoose, { Schema } from "mongoose";
import serviceSchema from "./service.model.js";
import slugify from "slugify";



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


        // all associated admins and officers (for easy querying) - can be used for notifications, access control, etc.
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true, // Department Admin,
                default: []
            },
        ],
        departmentOfficers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true, // Department Officer,
                default: []
            }
        ],


        departmentSlug: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);


departmentSchema.pre("validate", async function (next) {
    if (!this.departmentSlug && this.name) {
        const baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true
        });

        let slug = baseSlug;
        let counter = 1;

        // Check for existing slug
        while (
            await mongoose.models.Department.exists({
                departmentSlug: slug,
                _id: { $ne: this._id } // important for updates
            })
        ) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.departmentSlug = slug;
    }
    next();
});

const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);

export default Department;
