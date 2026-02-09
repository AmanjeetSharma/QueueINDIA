import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  Department  from "../models/department.model.js";















// Create Department
const createDepartment = asyncHandler(async (req, res) => {
    const {
        departmentCategory,
        name,
        address,
        contact,
        workingHours = [],   // now an array of workingHoursSchema
        services = [],       // array of serviceSchema
        tokenManagement,     // optional tokenManagementSchema
        isSlotBookingEnabled = true,
        bookingWindowDays = 7,
        priorityCriteria = {
            seniorCitizenAge: 60,
            allowPregnantWomen: true,
            allowDifferentlyAbled: true
        },
        status = "active"
    } = req.body;

    const missing = [];
    if (!departmentCategory) missing.push("departmentCategory");
    if (!name) missing.push("name");
    if (!address?.street) missing.push("address.street");
    if (!address?.city) missing.push("address.city");
    if (!address?.state) missing.push("address.state");
    if (!address?.pincode) missing.push("address.pincode");

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
        const codes = services.map(s => s.serviceCode?.toUpperCase());
        const dupCode = codes.find((c, i) => codes.indexOf(c) !== i);
        if (dupCode) {
            throw new ApiError(400, `Duplicate serviceCode detected: ${dupCode}`);
        }
    }

    // 🔁 Normalize services according to new schema
    const normalizedServices = services.map(service => ({
        name: service.name,
        serviceCode: service.serviceCode?.toUpperCase(),
        description: service.description || "",
        priorityAllowed: service.priorityAllowed ?? true,
        isDocumentUploadRequired: service.isDocumentUploadRequired ?? true,
        tokenManagement: service.tokenManagement || {
            maxDailyServiceTokens: null,
            maxTokensPerSlot: 10,
            queueType: "Hybrid",
            timeBtwEverySlot: 15,
            slotStartTime: "10:00",
            slotEndTime: "17:00",
            slotWindows: []
        },
        requiredDocs: service.requiredDocs?.map(doc => ({
            name: doc.name,
            description: doc.description || "",
            isMandatory: doc.isMandatory ?? true
        })) || []
    }));

    // 🔁 Validate working hours
    const normalizedWorkingHours = workingHours.map(wh => ({
        day: wh.day,
        isClosed: wh.isClosed || false,
        openTime: wh.openTime,
        closeTime: wh.closeTime
    }));

    // Validate that required times are present when not closed
    normalizedWorkingHours.forEach(wh => {
        if (!wh.isClosed) {
            if (!wh.openTime || !wh.closeTime) {
                throw new ApiError(400, `Open and close times are required for ${wh.day} when not closed`);
            }
        }
    });

    const department = await Department.create({
        departmentCategory,
        name,
        address: {
            street: address.street,
            city: address.city,
            district: address.district || "",
            state: address.state,
            pincode: address.pincode
        },
        contact: {
            phone: contact?.phone || "",
            email: contact?.email || "",
            website: contact?.website || ""
        },
        workingHours: normalizedWorkingHours,
        services: normalizedServices,
        tokenManagement: tokenManagement || {
            maxDailyServiceTokens: null,
            maxTokensPerSlot: 10,
            queueType: "Hybrid",
            timeBtwEverySlot: 15,
            slotStartTime: "10:00",
            slotEndTime: "17:00",
            slotWindows: []
        },
        isSlotBookingEnabled,
        bookingWindowDays: Math.min(Math.max(bookingWindowDays, 1), 30), // Clamp between 1-30
        priorityCriteria: {
            seniorCitizenAge: Math.max(priorityCriteria.seniorCitizenAge || 60, 0),
            allowPregnantWomen: priorityCriteria.allowPregnantWomen ?? true,
            allowDifferentlyAbled: priorityCriteria.allowDifferentlyAbled ?? true
        },
        status,
        createdBy: req.user._id,
        admins: [],
        ratings: []
    });

    await department.save();

    console.log(`🏛 Department Created → ${department.name} (ID: ${department._id})`);

    return res
        .status(201)
        .json(new ApiResponse(201, department, "Department created successfully"));
});






















// Update Department
const updateDepartment = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const updateData = req.body;

    if (!deptId) {
        throw new ApiError(400, "Department ID is required");
    }

    // 🔍 Fetch department FIRST (important)
    const department = await Department.findById(deptId);
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    // 🔐 AUTHORIZATION
    // SUPER_ADMIN → full access
    // ADMIN → only assigned department
    if (req.user.role === "ADMIN") {
        const isAssigned = department.admins.some(
            adminId => adminId.toString() === req.user._id.toString()
        );

        if (!isAssigned) {
            throw new ApiError(403, "You are not authorized to update this department");
        }
    }

    // 🛑 DUPLICATE CHECK (name + location)
    if (
        updateData.name ||
        updateData.address?.city ||
        updateData.address?.pincode
    ) {
        const duplicate = await Department.findOne({
            _id: { $ne: deptId },
            name: updateData.name?.trim() || department.name,
            "address.city": updateData.address?.city || department.address.city,
            "address.pincode": updateData.address?.pincode || department.address.pincode
        });

        if (duplicate) {
            throw new ApiError(409, "Another department already exists at this location");
        }
    }

    // ───── UPDATE BASIC FIELDS ─────
    if (updateData.departmentCategory !== undefined) {
        department.departmentCategory = updateData.departmentCategory;
    }

    if (updateData.name !== undefined) {
        department.name = updateData.name; 
        // 🔥 slug will auto-update via model hook
    }

    if (updateData.status !== undefined) {
        department.status = updateData.status;
    }

    // ───── ADDRESS ─────
    if (updateData.address) {
        department.address = {
            street: updateData.address.street || department.address.street,
            city: updateData.address.city || department.address.city,
            district: updateData.address.district || department.address.district,
            state: updateData.address.state || department.address.state,
            pincode: updateData.address.pincode || department.address.pincode
        };
    }

    // ───── CONTACT ─────
    if (updateData.contact) {
        department.contact = {
            phone: updateData.contact.phone || department.contact.phone,
            email: updateData.contact.email || department.contact.email,
            website: updateData.contact.website || department.contact.website
        };
    }

    // ───── WORKING HOURS ─────
    if (Array.isArray(updateData.workingHours)) {
        updateData.workingHours.forEach(wh => {
            if (!wh.isClosed && (!wh.openTime || !wh.closeTime)) {
                throw new ApiError(
                    400,
                    `Open and close times are required for ${wh.day}`
                );
            }
        });
        department.workingHours = updateData.workingHours;
    }

    // ───── SERVICES ─────
    if (Array.isArray(updateData.services)) {
        const codes = updateData.services.map(s => s.serviceCode?.toUpperCase());
        const dupCode = codes.find((c, i) => codes.indexOf(c) !== i);

        if (dupCode) {
            throw new ApiError(400, `Duplicate serviceCode detected: ${dupCode}`);
        }

        department.services = updateData.services.map(service => ({
            name: service.name,
            serviceCode: service.serviceCode?.toUpperCase(),
            description: service.description || "",
            priorityAllowed: service.priorityAllowed ?? true,
            isDocumentUploadRequired: service.isDocumentUploadRequired ?? true,
            tokenManagement: service.tokenManagement,
            requiredDocs: service.requiredDocs?.map(doc => ({
                name: doc.name,
                description: doc.description || "",
                isMandatory: doc.isMandatory ?? true
            })) || []
        }));
    }

    // ───── PRIORITY CRITERIA ─────
    if (updateData.priorityCriteria) {
        department.priorityCriteria = {
            seniorCitizenAge: Math.max(
                updateData.priorityCriteria.seniorCitizenAge ??
                department.priorityCriteria.seniorCitizenAge,
                0
            ),
            allowPregnantWomen:
                updateData.priorityCriteria.allowPregnantWomen ??
                department.priorityCriteria.allowPregnantWomen,
            allowDifferentlyAbled:
                updateData.priorityCriteria.allowDifferentlyAbled ??
                department.priorityCriteria.allowDifferentlyAbled
        };
    }

    // ───── BOOKING WINDOW ─────
    if (updateData.bookingWindowDays !== undefined) {
        department.bookingWindowDays = Math.min(
            Math.max(updateData.bookingWindowDays, 1),
            30
        );
    }

    // ───── SLOT BOOKING ─────
    if (updateData.isSlotBookingEnabled !== undefined) {
        department.isSlotBookingEnabled = updateData.isSlotBookingEnabled;
    }

    // ✅ SAVE (IMPORTANT)
    await department.save(); // hooks + validation + slug update

    console.log(`✳️ Department Updated → ${department.name}`);

    return res.status(200).json(
        new ApiResponse(200, department, "Department updated successfully")
    );
});





















// Get Departments with Filters & Pagination
const getDepartments = asyncHandler(async (req, res) => {
    const {
        search,
        category,
        city,
        pincode,
        state,
        status,
        serviceCode,
        minRating,
        page = 1,
        limit = 6,
        sortBy = "name",
        sortOrder = "asc"
    } = req.query;

    const filter = {};

    // 🔍 Search by name, services, or category
    if (search && search.trim().length > 0) {
        const searchTerm = search.trim();
        filter.$or = [
            { name: { $regex: searchTerm, $options: "i" } },
            { "services.name": { $regex: searchTerm, $options: "i" } },
            { departmentCategory: { $regex: searchTerm, $options: "i" } }
        ];
    }

    // 🎯 Filters
    if (category && category.trim().length > 0) {
        filter.departmentCategory = { $regex: category.trim(), $options: "i" };
    }
    if (city && city.trim().length > 0) {
        filter["address.city"] = { $regex: city.trim(), $options: "i" };
    }
    if (pincode && pincode.trim().length > 0) {
        filter["address.pincode"] = pincode.trim();
    }
    if (state && state.trim().length > 0) {
        filter["address.state"] = { $regex: state.trim(), $options: "i" };
    }
    if (status && status.trim().length > 0) {
        filter.status = status.trim();
    }

    // Service code filter
    if (serviceCode && serviceCode.trim().length > 0) {
        filter["services.serviceCode"] = serviceCode.trim().toUpperCase();
    }

    // Rating filter
    if (minRating && !isNaN(minRating)) {
        const ratingNum = parseFloat(minRating);
        if (ratingNum >= 1 && ratingNum <= 5) {
            filter["ratings.rating"] = { $gte: ratingNum };
        }
    }

    // Handle sorting
    const sortOptions = {};
    const validSortFields = ["name", "departmentCategory", "status"];
    const validSortOrder = ["asc", "desc"];

    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    const order = validSortOrder.includes(sortOrder) ? sortOrder : "asc";

    sortOptions[sortField] = order === "asc" ? 1 : -1;

    // Pagination
    const safeLimit = 6;
    const safePage = Math.max(1, parseInt(page));
    const skip = (safePage - 1) * safeLimit;

    const total = await Department.countDocuments(filter);

    // Fetch departments
    const departments = await Department.find(filter)
        .select("name departmentCategory address.city address.state address.pincode contact.phone contact.email status services ratings admins")
        .sort(sortOptions)
        .skip(skip)
        .limit(safeLimit)
        .lean();

    // Format response
    const formattedDepartments = departments.map(dep => {
        // Calculate average rating
        const avgRating = dep.ratings?.length > 0
            ? dep.ratings.reduce((sum, rating) => sum + rating.rating, 0) / dep.ratings.length
            : 0;

        // Count services
        const serviceCount = dep.services?.length || 0;

        // Get service names
        const serviceNames = dep.services?.map(s => s.name).slice(0, 3) || [];

        // Count active admins
        const adminCount = dep.admins?.filter(admin => admin).length || 0;

        return {
            _id: dep._id,
            name: dep.name,
            category: dep.departmentCategory,
            location: {
                city: dep.address?.city,
                state: dep.address?.state,
                pincode: dep.address?.pincode
            },
            contact: {
                phone: dep.contact?.phone,
                email: dep.contact?.email
            },
            status: dep.status,
            stats: {
                totalServices: serviceCount,
                totalAdmins: adminCount,
                totalRatings: dep.ratings?.length || 0,
                averageRating: parseFloat(avgRating.toFixed(1))
            },
            servicesPreview: serviceNames
        };
    });

    // Applied filters for debugging
    const appliedFilters = {
        search: search && search.trim().length > 0 ? search.trim() : null,
        category: category && category.trim().length > 0 ? category.trim() : null,
        city: city && city.trim().length > 0 ? city.trim() : null,
        state: state && state.trim().length > 0 ? state.trim() : null,
        pincode: pincode && pincode.trim().length > 0 ? pincode.trim() : null,
        status: status && status.trim().length > 0 ? status.trim() : null,
        serviceCode: serviceCode && serviceCode.trim().length > 0 ? serviceCode.trim().toUpperCase() : null,
        minRating: minRating && !isNaN(minRating) ? parseFloat(minRating) : null,
        sortBy: sortField,
        sortOrder: order,
        page: safePage,
        limit: safeLimit
    };

    // Only show filters that were actually provided
    const usedFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(([_, v]) => v !== null && v !== undefined)
    );

    console.log("📋 Fetched Departments List", {
        page: safePage,
        limit: safeLimit,
        totalDepartments: total,
        filtersApplied: usedFilters
    });

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page: safePage,
            totalPages: Math.ceil(total / safeLimit),
            limit: safeLimit,
            sortBy: sortField,
            sortOrder: order,
            departments: formattedDepartments,
            filters: usedFilters
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
