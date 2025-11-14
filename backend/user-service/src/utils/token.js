import jwt from "jsonwebtoken";
import crypto from "crypto";



const generateSessionId = () => {
    return crypto.randomBytes(32).toString("hex");
};



const generateAccessToken = (user) => {
    // console.log("access token expires in:", process.env.ACCESS_TOKEN_EXPIRE);
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
        }
    );
};



const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        { id: userId, sessionId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
        }
    );
};


const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};


export const generateOtp = (digits = 6) =>
    Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1)).toString();


export {
    generateSessionId,
    generateAccessToken,
    generateRefreshToken,
    generateVerificationToken,
};
