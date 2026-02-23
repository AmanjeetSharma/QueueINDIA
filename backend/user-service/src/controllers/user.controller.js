import fs from "fs";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { avatarValidator, phoneValidator, emailValidator } from "../utils/validators.js";
import { v2 as cloudinary } from "cloudinary";
import { generateOtp } from "../utils/token.js";
import { sendEmail } from "../services/sendEmail.js";
import { secondaryEmailOtpTemplate } from "../utils/emailTemplates/secondaryEmailOtp.js";
import { generateVerificationToken } from "../utils/token.js";
import { verificationEmail } from "../utils/emailTemplates/verificationEmail.js";











const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -sessions");
    // console.log("Fetching user profile for:", user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log("User profile fetched:", user.name);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "✅ User profile fetched successfully"));
});













/**
 * 🧩 Helper function to extract Cloudinary public_id from a full URL
 * Works even if the URL includes versioning (v12345)
 */
const extractPublicId = (url) => {
    // Ignore if URL is apart from cloudinary uploads
    if (!url || !url.includes("/upload/")) return null;
    // Example:
    // https://res.cloudinary.com/amanjeet/image/upload/v1762337048/QueueIndia/users/avatars/mawv22t3p6and0otju1l.png
    const parts = url.split("/upload/")[1]; // => v1762337048/QueueIndia/users/avatars/mawv22t3p6and0otju1l.png
    const withoutVersion = parts.replace(/^v\d+\//, ""); // => QueueIndia/users/avatars/mawv22t3p6and0otju1l.png
    return withoutVersion.split(".")[0]; // => QueueIndia/users/avatars/mawv22t3p6and0otju1l
};


const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    // console.log("Update Profile Request Body:", req.body);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { name, address } = req.body;

    // ✅ Validate name
    if (name && name.trim().length < 2) {
        throw new ApiError(400, "Name must be at least 2 characters long");
    }

    if (address) {
        user.address = {
            street: address.street?.trim() || user.address?.street || "",
            city: address.city?.trim() || user.address?.city || "",
            state: address.state?.trim() || user.address?.state || "",
            country: address.country?.trim() || user.address?.country || "",
            zipCode: address.zipCode?.trim() || user.address?.zipCode || ""
        };
    }

    // ✅ Handle avatar upload (via multipart form-data)
    const avatarFile = req?.files?.avatar?.[0];
    if (avatarFile && !avatarValidator(avatarFile)) {
        fs.unlinkSync(avatarFile.path);
        throw new ApiError(400, "Invalid avatar: only JPEG/PNG/WebP up to 2 MB allowed");
    }

    // ✅ Update allowed fields
    if (name) user.name = name.trim();

    // ✅ Handle avatar replacement
    if (avatarFile) {
        // 🧹 Delete old avatar only if it's hosted on Cloudinary
        if (user.avatar && user.avatar.includes("/upload/")) {
            try {
                const publicId = extractPublicId(user.avatar);
                console.log("Deleting old avatar with publicId:", publicId);

                const deleteResponse = await cloudinary.uploader.destroy(publicId);
                console.log("🧹 Old avatar deleted from Cloudinary:", deleteResponse);
            } catch (error) {
                console.error("⚠️ Error deleting old avatar:", error?.message);
            }
        } else {
            console.log("ℹ️  Old avatar not from Cloudinary — skipping delete.");
        }


        // ☁️ Upload new avatar to Cloudinary
        const uploadedAvatar = await uploadOnCloudinary(
            avatarFile.path,
            "QueueIndia/users/avatars"
        );

        if (!uploadedAvatar) {
            throw new ApiError(500, "⚠️ Error uploading new avatar");
        }

        // ✅ Save the new avatar URL in the user document
        user.avatar = uploadedAvatar;

        // 🧹 Delete local temp file after upload
        if (fs.existsSync(avatarFile.path)) {
            fs.unlinkSync(avatarFile.path);
            console.log("🧹 Local avatar file deleted after upload.");
        }
    }

    // ✅ Save updated user
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -sessions");

    console.log("✅ User profile updated:", updatedUser.name);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});











const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "Old password, new password, and confirmation are required");
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!complexityRegex.test(newPassword)) {
        throw new ApiError(
            400,
            "New password must include uppercase, lowercase, number, and special character"
        );
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirmation do not match");
    }

    const user = await User.findById(req.user._id).select("+password +sessions");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 🟢 New check: ensure user actually has a password set
    if (!user.password) {
        throw new ApiError(400, "You do not have a password set. Please use Google login to continue.");
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        throw new ApiError(400, "New password must be different from the old password");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.sessions.forEach((session) => {
        session.isActive = false;
        session.refreshToken = null;
    });

    await user.save();

    const options = {
        httpOnly: true,
        secure: false, // true in prod
        sameSite: 'strict',
    };

    console.log("✅ Password changed and all sessions invalidated for user:", user.name);
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Password changed and all sessions deactivated. Please log in again."));
});










const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await user.deleteOne();

    console.log("✅  User account deleted! Name:", user.name, "Email:", user.email);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "✅ Account deleted successfully"));
});













const listUserSessions = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const sessions = user.sessions.map((session) => ({
        // sessionId: session.sessionId,
        device: session.device,
        firstLogin: session.firstLogin,
        latestLogin: session.latestLogin,
        isActive: session.isActive,
    }));

    console.log(
        `✅  User sessions listed for: "${user.name}" . Sessions status: `,
        sessions.map(s => `${s.device} : ${s.isActive}`).join(", ")
    );
    return res
        .status(200)
        .json(new ApiResponse(200, sessions, "✅ User sessions listed successfully"));
});












const addPhone = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    if (!phoneValidator(phone)) {
        throw new ApiError(
            400,
            "Invalid phone number. Provide a valid 10-digit phone number."
        );
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 🔐 Unique phone check (against verified + pending)
    const phoneOwner = await User.findOne({
        $or: [{ phone }, { pendingPhone: phone }]
    });

    if (phoneOwner && phoneOwner._id.toString() !== user._id.toString()) {
        throw new ApiError(
            409,
            "This phone number is already linked with another account"
        );
    }

    // If already verified with same number
    if (user.phone === phone && user.isPhoneVerified) {
        throw new ApiError(409, "Phone number already verified");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.pendingPhone = phone;

    user.phoneVerificationCode = otp;
    user.phoneVerificationExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    console.log(`📲 OTP sent to ${phone}:`, otp);

    return res.status(200).json(
        new ApiResponse(
            200,
            { phone },
            "OTP sent to phone successfully"
        )
    );
});






const verifyPhone = asyncHandler(async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.phoneVerificationCode) {
        throw new ApiError(400, "No OTP request found");
    }

    if (user.phoneVerificationExpiry < Date.now()) {
        throw new ApiError(400, "OTP expired. Request a new one.");
    }

    if (user.phoneVerificationCode !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    // ✅ Move pendingPhone to main phone
    user.phone = user.pendingPhone;

    // Mark verified
    user.isPhoneVerified = true;

    // Clear temp + OTP fields
    user.pendingPhone = null;
    user.phoneVerificationCode = null;
    user.phoneVerificationExpiry = null;

    await user.save();

    console.log(
        `✅ Phone verified for user: ${user.name}, Phone: ${user.phone}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            { phone: user.phone },
            "✅ Phone verified successfully"
        )
    );
});
















const addSecondaryEmail = asyncHandler(async (req, res) => {
    // console.log("Request to add secondary email:", req.body);
    const { secondaryEmail } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(404, "User not found");
    if (!secondaryEmail || !emailValidator(secondaryEmail)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // If same as primary email, disallow
    if (user.email && user.email.toLowerCase() === secondaryEmail.toLowerCase()) {
        throw new ApiError(400, "Secondary email cannot be the same as primary email");
    }

    // If already verified and same, short-circuit
    if (
        user.secondaryEmail &&
        user.secondaryEmail.toLowerCase() === secondaryEmail.toLowerCase() &&
        user.secondaryEmailVerified
    ) {
        throw new ApiError(409, "Secondary email is already verified");
    }

    // Save new secondaryEmail (or re-verify existing)
    user.secondaryEmail = secondaryEmail.toLowerCase();
    user.secondaryEmailVerified = false;

    // Generate OTP valid for 10 minutes
    const otp = generateOtp(6);
    user.secondaryEmailVerificationCode = otp;
    user.secondaryEmailVerificationExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email
    await sendEmail(
        user.secondaryEmail,
        "Verify your secondary email",
        secondaryEmailOtpTemplate(otp, user.name || "there"),
        true
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { secondaryEmail: user.secondaryEmail }, "OTP sent to secondary email"));
});



// POST /api/v1/users/email/verify-secondary
const verifySecondaryEmail = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(404, "User not found");
    if (!otp || typeof otp !== "string") {
        throw new ApiError(400, "OTP is required");
    }

    const isExpired = !user.secondaryEmailVerificationExpiry || user.secondaryEmailVerificationExpiry < Date.now();
    const isMatch = user.secondaryEmailVerificationCode === otp;

    if (!isMatch || isExpired) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    user.secondaryEmailVerified = true;
    user.secondaryEmailVerificationCode = null;
    user.secondaryEmailVerificationExpiry = null;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { secondaryEmail: user.secondaryEmail, verified: true }, "Secondary email verified"));
});









const sendVerificationEmail = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const token = generateVerificationToken();
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 min validity
    await user.save();

    const emailContent = verificationEmail(token);
    await sendEmail(user.email, "Verify your email", emailContent, true);
    console.log(`Primary Verification email sent to ${user.email}`) ;

    res.status(200).json(new ApiResponse(200, {}, "Verification email sent"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired token");

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    console.log(`Primary Email verified for user: ${user.name}, Email: ${user.email}`);
    res.redirect(`${process.env.FRONTEND_URL}/profile?verified=true`);
});













const updateDOB = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { dob } = req.body;

    if (!dob) {
        throw new ApiError(400, "Date of birth is required");
    }

    // dd/mm/yyyy → [dd, mm, yyyy]
    const [day, month, year] = dob.split("/");

    // Validate format
    if (!day || !month || !year || year.length !== 4) {
        throw new ApiError(400, "Invalid DOB format. Use dd/mm/yyyy");
    }

    const parsedDate = new Date(`${year}-${month}-${day}`);

    // Validate valid date
    if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, "Invalid date value");
    }

    // No future DOB
    if (parsedDate > new Date()) {
        throw new ApiError(400, "DOB cannot be in the future");
    }

    // Optional: age check (remove if not needed)
    const age = new Date().getFullYear() - parsedDate.getFullYear();
    if (age < 0 || age > 120) {
        throw new ApiError(400, "Entered DOB results in invalid age");
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { dob: parsedDate },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: updatedUser },
            "Date of Birth updated successfully"
        )
    );
});








export {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    listUserSessions,
    addPhone,
    verifyPhone,
    addSecondaryEmail,
    verifySecondaryEmail,
    sendVerificationEmail,
    verifyEmail,
    updateDOB,
};