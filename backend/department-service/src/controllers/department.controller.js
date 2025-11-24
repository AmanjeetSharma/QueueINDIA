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
        services = [],   // optional now
        tokenManagement,
        counters = []    // optional now
    } = req.body;

    const missing = [];
    if (!departmentCategory) missing.push("departmentCategory");
    if (!name) missing.push("name");
    if (!address) missing.push("address");

    if (missing.length) {
        throw new ApiError(
            400,
            `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`
        );
    }

    // 🔍 Prevent duplicate department at same location
    const exist = await Department.findOne({
        name: name.trim(),
        "address.city": address.city,
        "address.pincode": address.pincode
    });

    if (exist) throw new ApiError(409, "Department already exists in this location");

    // 🛡 Ensure serviceCode uniqueness inside array
    if (services.length) {
        const codes = services.map(s => s.serviceCode);
        const dupCode = codes.find((c, i) => codes.indexOf(c) !== i);
        if (dupCode) {
            throw new ApiError(400, `Duplicate serviceCode detected: ${dupCode}`);
        }
    }

    // 🔁 Auto-fill missing optional fields for each service
    const normalizedServices = services.map(service => ({
        name: service.name,
        serviceCode: service.serviceCode,
        description: service.description || "",
        avgServiceTime: service.avgServiceTime || 15,
        avgWaitTime: service.avgWaitTime || null,
        requiredDocuments: service.requiredDocuments || [],
        bookingRequired: service.bookingRequired ?? true,
        maxBookingsPerDay: service.maxBookingsPerDay || null,
        counters: service.counters || []
    }));

    // 🔁 Validate consistent counter-service mapping
    if (counters.length) {
        counters.forEach(c => {
            if (!c.counterNumber) {
                throw new ApiError(400, "Every counter must have a counterNumber");
            }

            const invalidCodes = c.assignedServices?.filter(code =>
                !normalizedServices.some(s => s.serviceCode === code)
            );

            if (invalidCodes.length) {
                throw new ApiError(
                    400,
                    `Invalid assigned serviceCodes: ${invalidCodes.join(", ")}`
                );
            }
        });
    }

    const department = await Department.create({
        departmentCategory,
        name,
        address,
        contact,
        workingHours,
        services: normalizedServices,
        tokenManagement,
        counters,
        admins: [], // Add through Admin routes later
        createdBy: req.user._id,
    });

    console.log(`🏛 Department Created → ${department.name} (ID: ${department._id})`);

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

    // 🛑 Validate duplicate name + location
    if (updateData.name || updateData.address?.city || updateData.address?.pincode) {
        const exist = await Department.findOne({
            _id: { $ne: deptId },
            name: updateData.name?.trim() || department.name,
            "address.city": updateData.address?.city || department.address.city,
            "address.pincode": updateData.address?.pincode || department.address.pincode
        });

        if (exist) throw new ApiError(409, "Another department already exists at this location");
    }

    // 🟦 Normalize services (if updating)
    if (updateData.services && Array.isArray(updateData.services)) {
        // 🟡 Check duplicate serviceCode
        const codes = updateData.services.map(s => s.serviceCode);
        const dupCode = codes.find((c, i) => codes.indexOf(c) !== i);
        if (dupCode) {
            throw new ApiError(400, `Duplicate serviceCode detected: ${dupCode}`);
        }

        updateData.services = updateData.services.map(service => ({
            name: service.name,
            serviceCode: service.serviceCode,
            description: service.description || "",
            avgServiceTime: service.avgServiceTime || 15,
            avgWaitTime: service.avgWaitTime || null,
            requiredDocuments: service.requiredDocuments || [],
            bookingRequired: service.bookingRequired ?? true,
            maxBookingsPerDay: service.maxBookingsPerDay || null,
            counters: service.counters || []
        }));
    }

    // 🔹 Validate counters if provided
    if (updateData.counters && Array.isArray(updateData.counters)) {
        updateData.counters.forEach(counter => {
            if (!counter.counterNumber) {
                throw new ApiError(400, "Every counter must have a counterNumber");
            }
        });

        // Ensure counter assigned services actually exist
        const serviceList = updateData.services || department.services;
        updateData.counters.forEach(counter => {
            if (counter.assignedServices?.length) {
                const invalidCodes = counter.assignedServices.filter(
                    code => !serviceList.some(s => s.serviceCode === code)
                );

                if (invalidCodes.length) {
                    throw new ApiError(
                        400,
                        `Invalid serviceCodes for counter: ${invalidCodes.join(", ")}`
                    );
                }
            }
        });
    }

    const updatedDept = await Department.findByIdAndUpdate(deptId, updateData, {
        new: true,
        runValidators: true
    });

    console.log(`✳️ Department Updated → ${department.name} ▸ ${updatedDept.name}`);

    return res.status(200).json(
        new ApiResponse(200, updatedDept, "Department updated successfully")
    );
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

    // 🔍 Search by name (case-insensitive) - Only apply if search has non-space content
    if (search && search.trim().length > 0) {
        filter.name = { $regex: search.trim(), $options: "i" };
    }

    // 🎯 Filters - Only apply if they have non-space content
    if (category && category.trim().length > 0) {
        filter.departmentCategory = { $regex: category.trim(), $options: "i" };
    }
    if (city && city.trim().length > 0) {
        filter["address.city"] = { $regex: city.trim(), $options: "i" };
    }
    if (pincode && pincode.trim().length > 0) {
        filter["address.pincode"] = pincode.trim();
    }
    if (status && status.trim().length > 0) {
        filter.status = status.trim();
    }

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

    // Debug logging: show exactly which filters/search/pagination were used
    const appliedFilters = {
        search: search && search.trim().length > 0 ? search.trim() : null,
        category: category && category.trim().length > 0 ? category.trim() : null,
        city: city && city.trim().length > 0 ? city.trim() : null,
        pincode: pincode && pincode.trim().length > 0 ? pincode.trim() : null,
        status: status && status.trim().length > 0 ? status.trim() : null,
        page: safePage,
        limit: safeLimit,
        skip
    };

    // Only show filters that were actually provided (avoid noisy nulls)
    const usedFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(([_, v]) => v !== null && v !== undefined)
    );

    console.log("📋 Fetched Departments List", {
        page: safePage,
        limit: safeLimit,
        totalDepartmentsMatchingFilter: total,
        filtersApplied: usedFilters,
        selectedFields: "name departmentCategory address.city address.pincode contact.phone status createdAt"
    });

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

