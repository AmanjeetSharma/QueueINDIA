import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Department from "../models/department.model.js";







const getDepartmentStaff = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    if (!deptId) {
        throw new ApiError(400, "Department ID is required");
    }

    let departmentIdToUse;

    // SUPER_ADMIN → Can access any department
    if (req.user.role === "SUPER_ADMIN") {
        departmentIdToUse = deptId;

        // ADMIN → Can only access their assigned department
    } else {
        if (!req.user.departmentId) {
            throw new ApiError(403, "Admin not assigned to any department");
        }

        if (req.user.departmentId.toString() !== deptId) {
            throw new ApiError(403, "Access denied to this department");
        }

        departmentIdToUse = req.user.departmentId;
    }

    const department = await Department.findById(departmentIdToUse)
        .select("staff departmentOfficers name");

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    // Combine Admins + Officers
    const userIds = [
        ...(department.admins || []),
        ...(department.departmentOfficers || [])
    ];

    if (!userIds.length) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    departmentId: departmentIdToUse,
                    departmentName: department.name,
                    admins: [],
                    officers: []
                },
                "No staff assigned to this department yet"
            )
        );
    }

    // Remove duplicate IDs (safety)
    const uniqueUserIds = [...new Set(userIds.map(id => id.toString()))];

    // Extract access token to forward to User Service
    const token =
        req.headers.authorization ||
        (req.cookies?.accessToken
            ? `Bearer ${req.cookies.accessToken}`
            : null);

    if (!token) {
        throw new ApiError(401, "Unauthorized — Token required");
    }

    // Bulk fetch users from User Service
    const { data } = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/v1/users-dept/bulk`,
        { userIds: uniqueUserIds },
        { headers: { Authorization: token } }
    );

    const users = data?.data || [];

    // Separate roles
    const admins = users.filter(user => user.role === "ADMIN");
    const officers = users.filter(user => user.role === "DEPARTMENT_OFFICER");

    console.log(
        `Department Staff Fetched | Dept: ${department.name} | Admins: ${admins.length} | Officers: ${officers.length}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId: departmentIdToUse,
                departmentName: department.name,
                admins,
                officers
            },
            "Department staff fetched successfully"
        )
    );
});













const assignAdminToDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const { adminEmail } = req.body;

    if (!adminEmail) throw new ApiError(400, "Admin email is required");
    if (!deptId) throw new ApiError(400, "Department ID required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    // Auth Check: Only SUPER_ADMIN or Assigned Admin can add new admin
    const isAssignedAdmin = department.admins?.some(id => id.toString() === req.user._id.toString());
    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to assign admins to this department");
    }

    const token =
        req.headers.authorization ||
        (req.cookies?.accessToken ? `Bearer ${req.cookies.accessToken}` : null);

    if (!token) throw new ApiError(401, "Token required to verify user from User Service");

    let userServiceResponse;
    try {
        userServiceResponse = await axios.get(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/find-by-email?email=${adminEmail}`,
            {
                headers: { Authorization: token }
            }
        );
    } catch (err) {
        throw new ApiError(
            err.response?.status || 500,
            err.response?.data?.message || "User which was to be assigned as Admin not found"
        );
    }

    const user = userServiceResponse.data?.data;
    if (!user) throw new ApiError(404, "User not found");

    // Prevent duplicate admin assignment
    if (department.admins.includes(user._id)) {
        throw new ApiError(409, "User is already an admin of this department");
    }

    // Add new admin
    department.admins.push(user._id);
    await department.save();

    console.log(`✅ Assigned user ${user.email} as admin to department ${department.name}`);

    return res.status(200).json(
        new ApiResponse(200, department.admins, "Admin assigned successfully")
    );
});











const removeSelfFromAdmins = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    if (!deptId) throw new ApiError(400, "Department ID required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const adminId = req.user._id.toString();

    // Check if user is even an assigned admin
    const isAssignedAdmin = department.admins.some(
        (id) => id.toString() === adminId
    );

    // Prevent removing last admin
    if (department.admins.length === 1) {
        throw new ApiError(400, "Department must have at least one admin. Please assign another admin before removing yourself.");
    }

    department.admins = department.admins.filter(
        (id) => id.toString() !== adminId
    );

    await department.save();

    console.log(`✅ User ${req.user.email} removed themselves as admin from department ${department.name}`);

    return res
        .status(200)
        .json(new ApiResponse(200, department.admins, "You have been removed as admin"));
});










const removeAdminBySuperAdmin = asyncHandler(async (req, res) => {
    const { deptId, adminId } = req.params;

    if (!deptId || !adminId) {
        throw new ApiError(400, "Department ID and Admin ID required");
    }

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    // Check if user is in admins list
    const exists = department.admins.some(
        (id) => id.toString() === adminId
    );
    if (!exists) throw new ApiError(404, "Admin not found in this department");

    // Prevent removing last admin
    if (department.admins.length === 1) {
        throw new ApiError(400, "Department must have at least one admin");
    }

    department.admins = department.admins.filter(
        (id) => id.toString() !== adminId
    );

    await department.save();

    console.log(`✅ Admin (ID: ${adminId}) removed from department ${department.name} by SUPER_ADMIN`);

    return res
        .status(200)
        .json(new ApiResponse(200, department, "Admin removed successfully"));
});









export {
    getDepartmentStaff,
    assignAdminToDepartment,
    removeSelfFromAdmins,
    removeAdminBySuperAdmin,
};