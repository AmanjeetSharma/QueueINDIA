import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const findUserByEmail = asyncHandler(async (req, res) => {
    const email = req.query.email;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email }).select("_id name email role");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, `User found | ${user.email}`));
});





const bulkFetchUsers = asyncHandler(async (req, res) => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, "userIds array is required");
    }

    const users = await User.find(
        { _id: { $in: userIds } },
        "_id name email role"
    );

    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});

export { findUserByEmail, bulkFetchUsers };