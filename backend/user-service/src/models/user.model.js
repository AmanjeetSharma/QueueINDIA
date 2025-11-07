import mongoose, { Schema } from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    device: { type: String, default: 'Unknown Device' },
    refreshToken: String,
    firstLogin: { type: Date, default: Date.now },
    latestLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const addressSchema = new Schema(
    {
        street: { type: String, trim: true, default: null },
        city: { type: String, trim: true, default: null },
        state: { type: String, trim: true, default: null },
        country: { type: String, trim: true, default: null },
        zipCode: { type: String, trim: true, default: null },
    },
    { _id: false }
);


const userSchema = new Schema(
    {
        avatar: {
            type: String,   // cloudinary url
            required: false,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // So it does not conflict if empty
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            default: null,
        },
        verificationTokenExpiry: {
            type: Date,
            default: null,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN", "DEPARTMENT_OFFICER", "SUPER_ADMIN"],
            default: "USER",
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },
        // One optional secondary email for notifications
        secondaryEmail: { type: String, trim: true, lowercase: true, default: "" },
        secondaryEmailVerified: { type: Boolean, default: false },

        // OTP-based verification for secondary email
        secondaryEmailVerificationCode: { type: String, default: null }, // store 6-digit OTP (string)
        secondaryEmailVerificationExpiry: { type: Date, default: null },

        // Phone number for OTP verification
        phone: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },

        isPhoneVerified: {
            type: Boolean,
            default: false,
        },

        phoneVerificationCode: {
            type: String,
            default: null,
        },

        phoneVerificationExpiry: {
            type: Date,
            default: null,
        },

        address: {
            type: addressSchema,
            default: {},
        },
        sessions: [sessionSchema]
    }, { timestamps: true }
)

// Auto-calculate overall verification flag
userSchema.pre("save", function (next) {
    this.isVerified = this.isPhoneVerified || this.isSecondaryEmailVerified;
    next();
});
export const User = mongoose.model('User', userSchema);