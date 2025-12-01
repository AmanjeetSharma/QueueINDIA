import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, generateSessionId } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = asyncHandler(async (req, res) => {
    const { tokenId, device } = req.body;

    if (!tokenId) {
        throw new ApiError(400, "No Google token provided");
    }

    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ googleId });

    // If user not found by googleId → check by email
    if (!user) {
        user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            user.googleId = googleId;
            user.isEmailVerified = true;
            await user.save();
        } else {
            // Generate a basic username-like identifier (optional)
            const generatedName = name?.trim() || "User";
            const generatedEmailName = email.split("@")[0];

            user = await User.create({
                email: email.toLowerCase(),
                name: generatedName,
                password: null,
                isEmailVerified: true,
                avatar: picture || "",
                googleId,
                sessions: [],
            });
        }
    }

    // Create session
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id, sessionId);
    const accessToken = generateAccessToken(user);

    const deviceName = device || "Google Device";

    let existingSession = user.sessions.find((s) => s.device === deviceName);

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

    const cookieOptions = {
        httpOnly: true,
        secure: false, // must remain true in production
        sameSite: "Lax",
        path: "/",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar,
                        isEmailVerified: user.isEmailVerified,
                    },
                },
                "Logged in successfully via Google"
            )
        );
});
