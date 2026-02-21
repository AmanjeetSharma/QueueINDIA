import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";







const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized — No access token provided");
    }
    // rely on user-service to validate token
    try {
        const { data } = await axios.get(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/validate-token-department`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        // console.log("Token validation response from user-service:", data); // debug log

        if (!data?.success || !data?.data?.isActive) {
            throw new ApiError(403, "User is inactive or unauthorized");
        }

        // Attach fresh DB user
        req.user = data.data;

        next();
    } catch (error) {
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
