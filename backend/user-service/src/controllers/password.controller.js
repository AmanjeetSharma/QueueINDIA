import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import resetPasswordHtml from "../utils/emailTemplates/resetPasswordHtml.js";
import { phoneValidator, passwordValidator } from "../utils/validators.js";
import { isPasswordBreached } from "../utils/passwordBreachCheck.js";











// ================= FORGOT PASSWORD ===================
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Always send generic message to avoid account enumeration
    if (!user) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Reset email has been sent if the account exists."));
    }

    if (!user.password) {
        throw new ApiError(
            403,
            "This account uses Google Sign-in. Please log in using Google first and set a password in profile if needed."
        );
    }


    // OPTIONAL: block if email is not verified
    // if (!user.isEmailVerified) {
    //     throw new ApiError(403, "Email is not verified. Verify email before resetting password.");
    // }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = resetPasswordHtml(resetUrl);

    await sendEmail(user.email, "Password Reset Request", html, true);
    console.log(`📧 Password reset email sent → ${user.email}`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Reset email has been sent to the provided email address."));
});










// ================= RESET PASSWORD ===================
const resetPassword = asyncHandler(async (req, res) => {

    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        throw new ApiError(400, "Token, new password, and confirm password are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }


    const passwordCheck = passwordValidator(newPassword);

    if (!passwordCheck.valid) {
        throw new ApiError(
            400,
            `Password is missing: ${passwordCheck.errors.join(", ")}.`
        );
    }

    const passwordBreachCheck = await isPasswordBreached(newPassword);
    console.log(`🔒 Password breach check for "${newPassword}":`, passwordBreachCheck);
    if (passwordBreachCheck.breached) {
        throw new ApiError(
            400,
            `This password has been found in a data breach ${passwordBreachCheck.count} times. Please choose a different password.`
        );
    }



    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // 🔒 Invalidate all sessions after password reset (important!)
    user.sessions = [];

    await user.save();

    console.log(`🔐 Password reset successful for → ${user.email}`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Your password has been reset successfully."));
});

























// ================= FORGOT PASSWORD VIA PHONE ===================
const requestPhonePasswordReset = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    if (!phoneValidator(phone)) {
        throw new ApiError(400, "Invalid 10-digit phone number");
    }

    // Phone must be unique → findOne
    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
        throw new ApiError(404, "No account is linked with this phone number");
    }

    if (!user.password) {
        throw new ApiError(
            403,
            "This account uses Google Sign-in. Please log in using Google first and set a password in profile if needed."
        );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.phoneResetOTP = otp;
    user.phoneResetExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    console.log(`📲 Password-reset OTP for ${phone}: ${otp}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            { phone },
            "OTP has been sent to the provided phone number"
        )
    );
});






// ================= RESET PASSWORD VIA PHONE ===================
const resetPasswordWithPhone = asyncHandler(async (req, res) => {
    const { phone, otp, newPassword, confirmPassword } = req.body;


    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }
    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }
    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }
    if (!confirmPassword) {
        throw new ApiError(400, "Confirm password is required");
    }

    const passwordCheck = passwordValidator(newPassword);
    if (!passwordCheck.valid) {
        throw new ApiError(
            400,
            `Password is missing: ${passwordCheck.errors.join(", ")}.`
        );
    }
    const passwordBreachCheck = await isPasswordBreached(newPassword);
    console.log(`🔒 Password breach check for "${newPassword}":`, passwordBreachCheck);
    if (passwordBreachCheck.breached) {
        throw new ApiError(
            400,
            `This password has been found in a data breach ${passwordBreachCheck.count} times. Please choose a different password.`
        );
    }

    if (!phoneValidator(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    const user = await User.findOne({
        phone,
        phoneResetOTP: otp,
        phoneResetExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid OTP or OTP expired");
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP
    user.phoneResetOTP = null;
    user.phoneResetExpiry = null;

    await user.save();

    console.log(`🔐 Password reset via phone completed for ${phone}`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Your password has been reset successfully."));
});














const setPassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword || !confirmPassword) {
        throw new ApiError(400, "New password and confirm password are required");
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }
    const passwordCheck = passwordValidator(newPassword);

    if (!passwordCheck.valid) {
        throw new ApiError(
            400,
            `Password is missing: ${passwordCheck.errors.join(", ")}.`
        );
    }

    const passwordBreachCheck = await isPasswordBreached(newPassword);
    console.log(`🔒 Password breach check for "${newPassword}":`, passwordBreachCheck);
    if (passwordBreachCheck.breached) {
        throw new ApiError(
            400,
            `This password has been found in a data breach ${passwordBreachCheck.count} times. Please choose a different password.`
        );
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.password) {
        throw new ApiError(400, "Password is already set for this account");
    }
    user.hasPassword = true;
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    console.log(`🔐 Password set successfully for → ${user.email}`);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Your password has been set successfully."));
});







export {
    forgotPassword,
    resetPassword,
    requestPhonePasswordReset,
    resetPasswordWithPhone,
    setPassword
};