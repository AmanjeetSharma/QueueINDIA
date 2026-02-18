import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";







// Update your getAllUsers controller in user.controller.js
const getAllUsers = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // max 100
    const skip = (page - 1) * limit;

    /* ───── All Filters ───── */
    const {
        search = "",
        role,
        emailVerified,
        phoneVerified,
        status,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const filter = {};

    // Role filter
    if (role && role !== 'ALL') {
        filter.role = role;
    }

    // Email verification filter
    if (emailVerified !== undefined) {
        filter.isEmailVerified = emailVerified === 'true';
    }

    // Phone verification filter
    if (phoneVerified !== undefined) {
        filter.isPhoneVerified = phoneVerified === 'true';
    }

    // Status filter (you might need to add status field to User model)
    if (status && status !== 'ALL') {
        filter.status = status;
    }

    // Search across name, email, phone
    if (search.trim()) {
        filter.$or = [
            { name: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
            { phone: { $regex: search.trim(), $options: "i" } }
        ];
    }

    /* ───── Sorting ───── */
    const sortOptions = {};
    const validSortFields = ["name", "email", "role", "createdAt"];
    const validSortOrders = ["asc", "desc"];

    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = validSortOrders.includes(sortOrder) ? sortOrder : "desc";
    sortOptions[sortField] = order === "asc" ? 1 : -1;

    /* ───── Query users ───── */
    const users = await User.find(filter)
        .select(
            "name email phone role avatar isEmailVerified isPhoneVerified departmentId createdAt lastLogin"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    console.log(`✅ Super Admin fetched users: Page ${page} of ${totalPages}, Total Users: ${totalUsers}`);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            filters: {
                search,
                role,
                emailVerified,
                phoneVerified,
                status,
                sortBy: sortField,
                sortOrder: order
            }
        }, "Users fetched successfully")
    );
});













/**
 * @desc Force logout a user from all devices (Super Admin)
 * @route POST /api/v1/admin/users/:userId/force-logout
 * @access Super Admin
 */
const forceLogoutUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let revoked = 0;

    user.sessions.forEach(session => {
        if (session.isActive || session.refreshToken) {
            session.isActive = false;
            session.refreshToken = null;
            session.latestLogin = new Date();
            revoked++;
        }
    });

    // 🚨 Tell mongoose nested array changed
    user.markModified("sessions");

    await user.save();

    console.log(`🔐 SUPER ADMIN forced logout for: ${user.email}`);

    return res.status(200).json(
        new ApiResponse(200, {
            userId: user._id,
            sessionsRevoked: revoked
        }, "User logged out from all devices")
    );
});











const resetUserPasswordAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-8) +
        Math.random().toString(36).toUpperCase().slice(-4);

    // Hash the password
    user.password = await bcrypt.hash(randomPassword, 10);
    await user.save();

    // Send email with new password (implement email service)
    // await sendPasswordResetEmail(user.email, randomPassword);
    // temp: just log it
    console.log(`New password for ${user.email} | Password: ${randomPassword}`);

    console.log(`🔑 Super Admin reset password for user: ${user.email}`);

    return res.status(200).json(
        new ApiResponse(200, {
            temporaryPassword: randomPassword
        }, "Password reset successfully. Send this password to user securely.")
    );
});









const changeUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = [
        "USER",
        "ADMIN",
        "DEPARTMENT_OFFICER",
        "SUPER_ADMIN"
    ];

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (!role || !allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const requester = req.user; // Always SUPER_ADMIN (panel protected)

    const target = await User.findById(userId);
    if (!target) {
        throw new ApiError(404, "User not found");
    }

    // 🔒 Prevent modifying yourself
    if (requester._id.toString() === target._id.toString()) {
        throw new ApiError(403, "You cannot modify your own role");
    }

    const oldRole = target.role;

    // ❌ Prevent redundant change
    if (oldRole === role) {
        throw new ApiError(
            400,
            `User already has role ${role}`
        );
    }


    //  PROMOTION RULE:
    //  If promoting from USER or SUPER_ADMIN
    //  to ADMIN or DEPARTMENT_OFFICER
    //  user MUST already belong to a department

    if (
        ["ADMIN", "DEPARTMENT_OFFICER"].includes(role) &&
        !target.departmentId
    ) {
        throw new ApiError(
            400,
            "User must be assigned to a department before being promoted to ADMIN or DEPARTMENT_OFFICER"
        );
    }


    //  If changing to global role (USER or SUPER_ADMIN)
    //  remove from department service and clear departmentId

    if (["SUPER_ADMIN", "USER"].includes(role)) {

        const token =
            req.headers.authorization ||
            (req.cookies?.accessToken
                ? `Bearer ${req.cookies.accessToken}`
                : null);

        if (!token) {
            throw new ApiError(401, "Authorization token missing");
        }

        // If user belongs to a department, remove from department service
        if (target.departmentId) {
            try {
                await axios.patch(
                    `${process.env.DEPARTMENT_SERVICE_URL}/api/v1/departments/remove-staff-by-user/${target._id}`,
                    {},
                    { headers: { Authorization: token } }
                );
            } catch (err) {
                throw new ApiError(
                    err.response?.status || 500,
                    err.response?.data?.message ||
                    "Failed to sync with Department Service while removing staff"
                );
            }
        }

        target.departmentId = null;
    }

    // Updating role
    target.role = role;

    await target.save();

    console.log(
        `🔐 SUPER_ADMIN ${requester.email} changed ${target.email} role from ${oldRole} → ${role}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId: target._id,
                oldRole,
                newRole: role,
                departmentId: target.departmentId
            },
            "User role updated successfully"
        )
    );
});

















const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const admin = req.user;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // ❌ Prevent deleting self
    if (user._id.toString() === admin._id.toString()) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    // ❌ Only SUPER_ADMIN can delete ADMIN or SUPER_ADMIN
    if (
        ["ADMIN", "SUPER_ADMIN"].includes(user.role) &&
        admin.role !== "SUPER_ADMIN"
    ) {
        throw new ApiError(403, "Only Super Admin can delete admins");
    }

    /* ─────────── Kill all sessions & tokens ─────────── */

    user.sessions = [];
    user.refreshToken = null;
    user.phoneResetOTP = null;
    user.phoneResetExpiry = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    /* ─────────── Delete user ─────────── */

    await User.deleteOne({ _id: userId });

    console.log(
        `🗑️ ${admin.role} (${admin.email}) deleted user: ${user.email}`
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});



export {
    getAllUsers,
    forceLogoutUser,
    resetUserPasswordAdmin,
    changeUserRole,
    deleteUserByAdmin
};