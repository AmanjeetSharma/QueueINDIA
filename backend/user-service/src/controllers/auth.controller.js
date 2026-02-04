import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emailValidator, passwordValidator, avatarValidator } from "../utils/validators.js";
import { generateAccessToken, generateRefreshToken, generateSessionId } from '../utils/token.js';
import { getCookieOptions } from "../config/getCookieOptions.js";





/** 
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */

const register = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { name, email, password } = req.body;

    const requiredFields = { name, email, password };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value?.trim()) {
            throw new ApiError(400, `${key} is required`);
        }
    }

    if (!emailValidator(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    const passwordCheck = passwordValidator(password);

    if (!passwordCheck.valid) {
        throw new ApiError(
            400,
            `Password is missing: ${passwordCheck.errors.join(", ")}.`
        );
    }


    let existingUser = await User.findOne({
        email: email.toLowerCase(),
    }).select("+password");

    // Check avatar file
    const avatarFile = req?.files?.avatar?.[0];
    if (avatarFile && !avatarValidator(avatarFile)) {
        fs.unlinkSync(avatarFile.path);
        console.log("🗑️  Removed avatar image from localServer due to → invalid format or size.");
        throw new ApiError(400, "Invalid avatar: must be JPEG/PNG/WebP and ≤ 2 MB");
    }

    // If user already exists
    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            if (existingUser.password) {
                if (avatarFile?.path) {
                    fs.unlinkSync(avatarFile.path);
                    console.log("🗑️  Removed avatar image from localServer due to → existing user with password.");
                }
                throw new ApiError(409, "A user already exists with this email");
            } else {
                throw new ApiError(
                    409,
                    "This email is registered via Google Sign-in. Please log in using Google and set a password in profile if needed."
                );
            }
        }
    }

    // If no existing user, create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = null;
    const avatarLocalPath = avatarFile?.path;
    if (avatarLocalPath) {
        const avatarResult = await uploadOnCloudinary(
            avatarLocalPath,
            "QueueIndia/users/avatars"
        );
        if (!avatarResult) {
            throw new ApiError(500, "⚠️ Error uploading avatar image");
        }
        avatarUrl = avatarResult;
    }

    const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        hasPassword: true,
        avatar: avatarUrl || "",
        
    });

    const isUserCreated = await User.findById(newUser._id).select("-password -sessions");

    if (!isUserCreated) {
        throw new ApiError(500, "Error while registering the user");
    }
    console.log(`✅ New user registered: "${newUser.name}" (${newUser.email})`);
    return res
        .status(201)
        .send(new ApiResponse(201, isUserCreated, "✅ User registered successfully"));
});















/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { email, password, device } = req.body;

    // Basic validation
    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        throw new ApiError(401, "User does not exist");
    }

    if (!user.password) {
        throw new ApiError(
            401,
            "This account was registered using Google. Please set a password in profile to enable password login."
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    // Session generation
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id, sessionId);
    const accessToken = generateAccessToken(user);

    const deviceName = device || "Unknown Device";
    const existingSession = user.sessions.find(
        (session) => session.device === deviceName
    );

    if (existingSession) {
        existingSession.sessionId = sessionId;
        existingSession.refreshToken = refreshToken;
        existingSession.latestLogin = new Date();
        existingSession.isActive = true;
    } else {
        user.sessions.push({
            sessionId,
            device: deviceName,
            refreshToken,
            firstLogin: new Date(),
            latestLogin: new Date(),
            isActive: true,
        });
    }

    await user.save();

    const loggedInUser = await User.findById(user._id).select(
        "-password -sessions"
    );

    
    console.log(
        `✅ ${user.name} logged in successfully. Device: ${deviceName}`
    );

    const cookieOptions = getCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser
                },
                "✅ User logged in successfully"
            )
        );
});









/**
 * @desc Logout user from current device
 * @route POST /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        console.log("🚫🔑 No token provided");
        throw new ApiError(401, "No token provided");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        console.log("⚠️ Invalid or expired refresh token");
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
        console.log("❌ User not found during logout");
        throw new ApiError(404, "User not found");
    }

    const session = user.sessions.find(
        (s) => s.sessionId === decodedToken.sessionId && s.refreshToken === token
    );

    if (session) {
        session.isActive = false;
        session.refreshToken = null;
        session.latestLogin = new Date(); // optional: log logout timestamp
        await user.save();
    }

    const cookieOptions = getCookieOptions();

    console.log(`✅ ${user.name} logged out successfully from device: ${session?.device || "Unknown Device"}`);
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});













/**
 * @desc Logout from all devices
 * @route POST /api/v1/auth/logout-all
 * @access Private
 */
const logoutAllDevices = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        console.log("🚫🔑 No token provided");
        throw new ApiError(401, "No token provided");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        console.log("⚠️ Invalid or expired refresh token");
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
        console.log("❌ User not found");
        throw new ApiError(404, "User not found");
    }

    // Invalidate all sessions
    user.sessions.forEach((session) => {
        session.isActive = false;
        session.refreshToken = null;
    });
    await user.save();

    const cookieOptions = getCookieOptions();

    console.log(
        `✅ ${user.name} logged out from all devices: ${user.sessions.map((s) => s.device || "Unknown Device").join(", ")}`
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully from all devices"));
});











const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        console.log("🚫🔑 No refresh token provided (RefreshHandler.controller)");
        throw new ApiError(401, "No refresh token provided");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.log("⚠️ Invalid or expired refresh token");
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        console.log("❌ User not found");
        throw new ApiError(404, "User not found");
    }

    const session = user.sessions.find(
        (s) => s.sessionId === decoded.sessionId && s.refreshToken === token && s.isActive
    );

    if (!session) {
        console.log("❌ Invalid session or session is inactive");
        throw new ApiError(403, "Invalid session or session is inactive");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Update session activity timestamp
    session.latestLogin = new Date();
    await user.save();

    console.log(
        `✅ Access token refreshed successfully for user: "${user.name}" | Device: ${session.device || "Unknown Device"}`
    );

    const cookieOptions = getCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken },
                "✅ Access token refreshed successfully"
            )
        );
});





export {
    register,
    login,
    logout,
    logoutAllDevices,
    refresh
};