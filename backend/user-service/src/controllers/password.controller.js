import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../services/sendEmail.js";
import resetPasswordHtml from "../utils/emailTemplates/resetPasswordHtml.js";
import { phoneValidator, passwordValidator } from "../utils/validators.js";
import { isPasswordBreached } from "../utils/passwordBreachCheck.js";
import { set } from "mongoose";











// ================= FORGOT PASSWORD ===================
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    const message = "A reset email has been sent, if the account exists.";

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // 2 second delay
    await delay(2000); // Simulate processing delay to mitigate timing attacks
    // Always send generic message to avoid account enumeration
    if (!user) {
        console.log(`No email sent - no account found for → ${email}`);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, message));
    }

    if (!user.password) {
        throw new ApiError(
            403,
            "This account uses Google Sign-in. Please log in using Google first and set a password in profile if needed."
        );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = resetPasswordHtml(resetUrl);

    try {
        await sendEmail(user.email, "Password Reset Request", html, true);
    } catch (error) {
        throw new ApiError(500, "Error sending email. Email service might be down. Please try again later.");
    }
    console.log(`📧 Password reset email sent → ${user.email}`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, message));
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

    // const passwordBreachCheck = await isPasswordBreached(newPassword);
    // // console.log(`🔒 Password breach check for "${newPassword}":`, passwordBreachCheck); // debug log
    // if (passwordBreachCheck.breached) {
    //     throw new ApiError(
    //         400,
    //         `This password has been found in a data breach ${passwordBreachCheck.count} times. Please choose a different password.`
    //     );
    // }



    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "This password reset link/token is invalid or has expired");
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






// Reset password using phone OTP
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
    // const passwordBreachCheck = await isPasswordBreached(newPassword);
    // console.log(`🔒 Password breach check for "${newPassword}":`, passwordBreachCheck);
    // if (passwordBreachCheck.breached) {
    //     throw new ApiError(
    //         400,
    //         `This password has been found in a data breach ${passwordBreachCheck.count} times. Please choose a different password.`
    //     );
    // }

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













// Set password for accounts that were created via Google Sign-in and don't have a password yet
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