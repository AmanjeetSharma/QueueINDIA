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
        .select("staff name");

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    const userIds = department.staff?.map(s => s.userId) || [];

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

    // Remove duplicates (safety)
    const uniqueUserIds = [...new Set(userIds.map(id => id.toString()))];

    // Extract token
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

    // Convert users array to Map for fast lookup
    const userMap = new Map(
        users.map(u => [u._id.toString(), u])
    );

    const admins = [];
    const officers = [];

    department.staff.forEach(staffMember => {
        const user = userMap.get(staffMember.userId.toString());
        if (!user) return;

        const enrichedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: staffMember.role, // department-level role
            joinedAt: staffMember.joinedAt,
            assignedBy: staffMember.assignedBy
        };

        if (staffMember.role === "ADMIN") {
            admins.push(enrichedUser);
        } else if (staffMember.role === "DEPARTMENT_OFFICER") {
            officers.push(enrichedUser);
        }
    });


    // console.log("admins:", admins); Debug log
    // console.log("officers:", officers); Debug log

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














const assignStaffToDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const { email, role } = req.body;

    if (!deptId) {
        throw new ApiError(400, "Department ID is required");
    }

    if (!email || !role) {
        throw new ApiError(400, "Email and role are required");
    }


    const department = await Department.findById(deptId);
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    if (req.user.role === "ADMIN") {
        // Admin must belong to this department
        if (!req.user.departmentId || req.user.departmentId.toString() !== deptId) {
            throw new ApiError(403, "You can only assign staff to your own department");
        }

        // Admin must already be ADMIN in this department
        const isAdmin = department.staff.some(
            s =>
                s.role === "ADMIN" &&
                s.userId.toString() === req.user._id.toString()
        );

        if (!isAdmin) {
            throw new ApiError(403, "Only department admins can assign staff");
        }
    }

    const token =
        req.headers.authorization ||
        (req.cookies?.accessToken
            ? `Bearer ${req.cookies.accessToken}`
            : null);

    if (!token) {
        throw new ApiError(401, "Token required");
    }

    let userServiceResponse;
    try {
        userServiceResponse = await axios.get(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/find-by-email?email=${email}`,
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw new ApiError(
            err.response?.status || 500,
            err.response?.data?.message || "User not found | User service error"
        );
    }

    const user = userServiceResponse.data?.data;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === "SUPER_ADMIN") {
        throw new ApiError(
            400,
            "SUPER ADMIN (devs) cannot be assigned to any department"
        );
    }


    // 1️⃣ Prevent duplicate assignment in same department
    const alreadyAssigned = department.staff.some(
        s => s.userId.toString() === user._id.toString()
    );

    if (alreadyAssigned) {
        throw new ApiError(409, "User already assigned to this department");
    }

    // 2️⃣ Prevent assignment if user already assigned to another department
    const existingDepartment = await Department.findOne({
        "staff.userId": user._id
    });

    if (existingDepartment) {
        throw new ApiError(
            409,
            `User is already assigned to department: ${existingDepartment.name}`
        );
    }


    department.staff.push({
        userId: user._id,
        role,
        assignedBy: req.user._id
        // joinedAt auto-set
    });


    try {
        await axios.patch(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/${user._id}/assign-department`,
            { departmentId: deptId, role },
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw new ApiError(
            err.response?.status || 500,
            err.response?.data?.message || "Failed to update user department assignment | User service error"
        );
    }

    await department.save();

    console.log(
        `Staff Assigned | Dept: ${department.name} | User: ${user.email} | Role: ${role} | Assigned By: ${req.user.email}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId: deptId,
                assignedUser: {
                    _id: user._id,
                    email: user.email,
                    role
                }
            },
            "Staff assigned successfully"
        )
    );
});












const updateStaffRole = asyncHandler(async (req, res) => {
    const { deptId, userId } = req.params;
    const { role } = req.body;

    if (!deptId || !userId) {
        throw new ApiError(400, "Department ID and User ID are required");
    }

    const department = await Department.findById(deptId);
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    if (req.user.role === "ADMIN") {

        // Must belong to department
        if (!req.user.departmentId || req.user.departmentId.toString() !== deptId) {
            throw new ApiError(403, "You can only modify your own department");
        }

        // Must already be ADMIN in department
        const isAdmin = department.staff.some(
            s =>
                s.role === "ADMIN" &&
                s.userId.toString() === req.user._id.toString()
        );

        if (!isAdmin) {
            throw new ApiError(403, "Only department admins can change roles");
        }
    }

    const staffMember = department.staff.find(
        s => s.userId.toString() === userId
    );

    if (!staffMember) {
        throw new ApiError(404, "User is not assigned to this department");
    }

    // if (staffMember.role === "ADMIN" && role !== "ADMIN") {

    //     const adminCount = department.staff.filter(
    //         s => s.role === "ADMIN"
    //     ).length;

    //     if (adminCount <= 1) {
    //         throw new ApiError(
    //             400,
    //             "Cannot downgrade the last ADMIN of the department"
    //         );
    //     }
    // }

    staffMember.role = role;
    const token =
        req.headers.authorization ||
        (req.cookies?.accessToken
            ? `Bearer ${req.cookies.accessToken}`
            : null);
    try {
        await axios.patch(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/${userId}/update-department-role`,
            { role },
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw new ApiError(
            err.response?.status || 500,
            err.response?.data?.message || "Failed to update user's role | User service error"
        );
    }

    await department.save();

    console.log(
        `Role Updated | Dept: ${department.name} | User: ${userId} | New Role: ${role} | Updated By: ${req.user.email}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId: deptId,
                userId,
                newRole: role
            },
            "Staff role updated successfully"
        )
    );
});














const removeStaff = asyncHandler(async (req, res) => {
    const { deptId, userId } = req.params;

    if (!deptId || !userId) {
        throw new ApiError(400, "Department ID and User ID are required");
    }

    const department = await Department.findById(deptId);
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    if (req.user.role === "ADMIN") {

        // Admin can only remove from his own department
        if (!req.user.departmentId || req.user.departmentId.toString() !== deptId) {
            throw new ApiError(403, "You can only remove staff from your own department");
        }

        // Admin must already be ADMIN in department
        const isAdmin = department.staff.some(
            s =>
                s.role === "ADMIN" &&
                s.userId.toString() === req.user._id.toString()
        );

        if (!isAdmin) {
            throw new ApiError(403, "Only department admins can remove staff");
        }
    }

    if (req.user._id.toString() === userId) {
        throw new ApiError(400, "You cannot remove yourself from the department | Please contact another admin");
    }

    const staffIndex = department.staff.findIndex(
        s => s.userId.toString() === userId
    );

    if (staffIndex === -1) {
        throw new ApiError(404, "User is not assigned to this department");
    }

    // const staffMember = department.staff[staffIndex];

    // if (staffMember.role === "ADMIN") {
    //     const adminCount = department.staff.filter(
    //         s => s.role === "ADMIN"
    //     ).length;

    //     if (adminCount <= 1) {
    //         throw new ApiError(
    //             400,
    //             "LAST ADMIN ALERT: Cannot remove the last ADMIN of the department | Please assign another ADMIN before removing"
    //         );
    //     }
    // }

    department.staff.splice(staffIndex, 1);


    const token =
        req.headers.authorization ||
        (req.cookies?.accessToken
            ? `Bearer ${req.cookies.accessToken}`
            : null);

    try {
        await axios.patch(
            `${process.env.USER_SERVICE_URL}/api/v1/users-dept/${userId}/remove-department`,
            {},
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw new ApiError(
            err.response?.status || 500,
            err.response?.data?.message || "Failed to remove user's departmentId | User service error"
        );
    }


    await department.save();

    console.log(
        `Staff Removed | Dept: ${department.name} | Removed User: ${userId} | Removed By: ${req.user.email}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId: deptId,
                removedUserId: userId
            },
            "Staff removed successfully"
        )
    );
});








const removeStaffByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find department where user exists in staff
    const department = await Department.findOne({
        "staff.userId": userId
    });

    // If not found → safe exit (idempotent behavior)
    if (!department) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    userId,
                    removed: false
                },
                "User was not assigned to any department"
            )
        );
    }

    // Remove user from staff array
    department.staff = department.staff.filter(
        s => s.userId.toString() !== userId
    );

    await department.save();

    console.log(
        `🔄 Staff Auto-Removed | Dept: ${department.name} | User ID: ${userId} | Triggered By: ${req.user.email}`
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                departmentId: department._id,
                userId,
                removed: true
            },
            "User removed from department staff for role change b"
        )
    );
});






export {
    getDepartmentStaff,
    assignStaffToDepartment,
    updateStaffRole,
    removeStaff,
    removeStaffByUserId,
};