import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";









const validateTokenForDepartment = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized — user context missing");
    }

    // Optional: block inactive users explicitly
    if (req.user.isActive === false) {
        throw new ApiError(403, "User account is inactive");
    }

    const UserData = {
        _id: req.user._id,
        role: req.user.role,
        departmentId: req.user.departmentId || null,
        isActive: req.user.isActive ?? true,
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isEmailVerified ||
            req.user.isPhoneVerified ||
            req.user.secondaryEmailVerified || false
    };

    console.log(`Token Validated for Department-Service | User: ${req.user.email} | Role: ${req.user.role}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            UserData,
            `Token validated successfully | ${req.user._id}`
        )
    );
});










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
        "_id name email role phone avatar"
    );

    console.log(`Bulk staff fetched | Requested IDs: ${userIds.length} | Found Users: ${users.length} | users: ${users.map(u => u.email).join(", ")}`);
    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});









const assignDepartmentToUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { departmentId, role } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (!departmentId) {
        throw new ApiError(400, "Department ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // ❌ Prevent assigning department to SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
        throw new ApiError(
            400,
            "SUPER_ADMIN cannot be assigned to any department"
        );
    }


    // ❌ Prevent multi-department assignment
    if (user.departmentId && user.departmentId.toString() !== departmentId) {
        throw new ApiError(
            409,
            "User is already assigned to another department"
        );
    }

    user.departmentId = departmentId;
    user.role = role;

    await user.save();

    console.log(
        `User Department Assigned | User: ${user.email} | Department ID: ${departmentId}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId: user._id,
                departmentId: user.departmentId
            },
            "Department assigned to user successfully"
        )
    );
});










const removeDepartmentFromUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Prevent removing department from SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
        throw new ApiError(
            400,
            "SUPER_ADMIN does not belong to any department by default"
        );
    }

    user.departmentId = null;

    // Optional: downgrade role to CITIZEN or default role
    user.role = "USER";

    await user.save();

    console.log(
        `User's Department Removed and Role changed to "USER" | User: ${user.email}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId: user._id,
                departmentId: null,
                role: user.role
            },
            "Department removed from user successfully"
        )
    );
});










const updateUserDepartmentRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // SUPER_ADMIN role cannot be modified
    if (user.role === "SUPER_ADMIN") {
        throw new ApiError(
            400,
            "Super Admin role cannot be modified"
        );
    }

    if (!user.departmentId) {
        throw new ApiError(
            400,
            "User is not assigned to any department"
        );
    }

    user.role = role;

    await user.save();

    console.log(
        `User Role Updated | User: ${user.email} | New Role: ${role}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId: user._id,
                newRole: role
            },
            "User role updated successfully"
        )
    );
});







export {
    validateTokenForDepartment,
    findUserByEmail,
    bulkFetchUsers,
    assignDepartmentToUser,
    removeDepartmentFromUser,
    updateUserDepartmentRole
};