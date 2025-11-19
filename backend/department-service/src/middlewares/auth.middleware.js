import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";



const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized — No access token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // No DB call — trust user-service issued token
        req.user = decoded;

        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired access token");
    }
});



// Restrict access by user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access denied — ${req.user.role} is not allowed to perform this action`
            );
        }
        next();
    };
};

export { verifyToken, authorizeRoles };
