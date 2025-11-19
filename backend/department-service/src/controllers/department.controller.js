import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";








// Create Department
const createDepartment = asyncHandler(async (req, res) => {
    const {
        departmentCategory,
        name,
        address,
        contact,
        workingHours,
        services,
        tokenManagement,
    } = req.body;

    const missing = [];
    if (!departmentCategory) missing.push("departmentCategory");
    if (!name) missing.push("name");
    if (!address) missing.push("address");
    if (missing.length) {
        throw new ApiError(400, `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`);
    }

    // Prevent duplicate department at same location
    const exist = await Department.findOne({
        name: name.trim(),
        "address.city": address.city,
        "address.pincode": address.pincode
    });

    if (exist) throw new ApiError(409, "Department already exists in this location");

    const department = await Department.create({
        departmentCategory,
        name,
        address,
        contact,
        workingHours,
        services,
        tokenManagement,
        admins: [], // 👈 Empty list for now — will be managed later via admin routes
        createdBy: req.user._id,
    });

    console.log(`📌 Department Created: ${department.name} (ID: ${department._id})`);

    return res
        .status(201)
        .json(new ApiResponse(201, department, "Department created successfully"));
});













// Update Department
const updateDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const updateData = { ...req.body };

    if (!deptId) throw new ApiError(400, "Department ID required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    // Authorization: ADMIN can only update their own dept
    const isAssignedAdmin = department.admins?.some(
        adminId => adminId.toString() === req.user._id.toString()
    );


    if (req.user.role === "ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "You are not authorized to update this department");
    }

    // Prevent duplicates on unique fields
    if (updateData.name || updateData.address?.city || updateData.address?.pincode) {
        const exist = await Department.findOne({
            _id: { $ne: deptId },
            name: updateData.name?.trim() || department.name,
            "address.city": updateData.address?.city || department.address.city,
            "address.pincode": updateData.address?.pincode || department.address.pincode
        });

        if (exist) throw new ApiError(409, "Department already exists in this location");
    }

    const updatedDept = await Department.findByIdAndUpdate(deptId, updateData, {
        new: true,
        runValidators: true
    });

    console.log(`✅ Department updated from name: ${department.name} to ${updatedDept.name} (ID: ${updatedDept._id})`);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedDept, "Department updated successfully"));
});












// Get Departments with Filters & Pagination
const getDepartments = asyncHandler(async (req, res) => {
    const {
        search,
        category,
        city,
        pincode,
        status,
        page = 1,
        limit = 10,
    } = req.query;

    const filter = {};

    // 🔍 Search by name (case-insensitive)
    if (search) {
        filter.name = { $regex: search.trim(), $options: "i" };
    }

    // 🎯 Filters
    if (category) filter.departmentCategory = { $regex: category.trim(), $options: "i" };
    if (city) filter["address.city"] = { $regex: city.trim(), $options: "i" };
    if (pincode) filter["address.pincode"] = pincode;
    if (status) filter.status = status;

    const safeLimit = Math.max(1, Math.min(parseInt(limit), 50));
    const safePage = Math.max(1, parseInt(page));
    const skip = (safePage - 1) * safeLimit;

    const total = await Department.countDocuments(filter);

    const departments = await Department.find(filter)
        .select("name departmentCategory address.city address.pincode contact.phone status createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit);

    // 🪄 Light response formatting for UI
    const formattedDepartments = departments.map(dep => ({
        _id: dep._id,
        name: dep.name,
        category: dep.departmentCategory,
        city: dep.address?.city,
        pincode: dep.address?.pincode,
        phone: dep.contact?.phone,
        status: dep.status,
        createdAt: dep.createdAt,
        updatedAt: dep.updatedAt
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page: safePage,
            totalPages: Math.ceil(total / safeLimit),
            limit: safeLimit,
            departments: formattedDepartments,
        }, "Departments fetched successfully")
    );
});











// Delete Department
const deleteDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    if (!deptId) throw new ApiError(400, "Department ID is required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    await Department.findByIdAndDelete(deptId);

    console.log(`🗑️ Department deleted: ${department.name} (ID: ${department._id})`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Department deleted successfully"));
});















// Get Department by ID
const getDepartmentById = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    if (!deptId) {
        throw new ApiError(400, "Department ID is required");
    }

    const department = await Department.findById(deptId);

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    console.log(`🔍 Fetched details for Department: ${department.name} (ID: ${department._id})`);

    return res
        .status(200)
        .json(new ApiResponse(200, department, "Department details fetched successfully"));
});







export {
    createDepartment,
    updateDepartment,
    getDepartments,
    deleteDepartment,
    getDepartmentById
};





























// console.log("Calling User Service with forwarded token...");

// Check for token in both header + cookie
// let token =
//     req.headers.authorization ||
//     (req.cookies?.accessToken ? `Bearer ${req.cookies.accessToken}` : null);

// if (!token) {
//     throw new ApiError(401, "Unauthorized — No token found to call User Service");
// }

// let userServiceResponse;
// try {
//     userServiceResponse = await axios.get(
//         `${process.env.USER_SERVICE_URL}/api/v1/users-dept/find-by-email?email=${adminEmail}`,
//         {
//             headers: {
//                 Authorization: token,
//                 "Content-Type": "application/json"
//             }
//         }
//     );
// } catch (err) {
//     throw new ApiError(
//         err.response?.status || 500,
//         err.response?.data?.message || "User which was to be assigned as Admin not found"
//     );
// }

// const adminUser = userServiceResponse.data?.data;

// if (!adminUser) throw new ApiError(404, "Admin user not found");

