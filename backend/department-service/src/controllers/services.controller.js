import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";






// Add a new service to a department
const addService = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const {
        name,
        serviceCode,
        description,
        avgServiceTime,
        requiredDocs,
        maxDailyServiceTokens,
        counters,
        priorityAllowed
    } = req.body;

    if (!name || !serviceCode) {
        throw new ApiError(400, "name and serviceCode are required");
    }

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    // Authorization
    const isAssignedAdmin = department.admins.some(
        id => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to add service");
    }

    // 🔁 Prevent duplicate serviceCode
    if (department.services.some(s => s.serviceCode === serviceCode)) {
        throw new ApiError(409, "Service with this code already exists in this department");
    }

    // 📝 Validate counter mapping if provided
    if (counters && counters.length > 0) {
        const invalidCounters = counters.filter(
            c => !department.counters?.some(cnt => cnt.counterNumber === c)
        );

        if (invalidCounters.length > 0) {
            throw new ApiError(
                400,
                `Invalid counters: ${invalidCounters.join(", ")}`
            );
        }
    }

    // 🟦 Build service object properly formatted
    const newService = {
        name,
        serviceCode,
        description: description || "",
        avgServiceTime: avgServiceTime || 15,
        requiredDocs: requiredDocs || [],
        maxDailyServiceTokens: maxDailyServiceTokens || null,
        counters: counters || [],
        priorityAllowed: priorityAllowed ?? true
    };

    department.services.push(newService);
    await department.save();

    const savedService = department.services[department.services.length - 1];

    console.log(`🆕 Service Added: ${savedService.name} (${savedService.serviceCode})`);

    return res.status(201).json(
        new ApiResponse(201, savedService, "Service added successfully")
    );
});











// Update service details
const updateService = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;
    const updateData = req.body;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    // 🔐 Authorization: SUPER_ADMIN or assigned ADMIN only
    const isAssignedAdmin = department.admins.some(
        id => id.toString() === req.user._id.toString()
    );
    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to update service");
    }

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found");

    // 🔁 Prevent duplicate serviceCode if changed
    if (updateData.serviceCode && updateData.serviceCode !== service.serviceCode) {
        if (department.services.some(
            s => s.serviceCode === updateData.serviceCode && s._id.toString() !== serviceId
        )) {
            throw new ApiError(409, "Another service already has this serviceCode");
        }
    }

    // 🧮 Validate counters if included
    if (updateData.counters && Array.isArray(updateData.counters)) {
        const invalidCounters = updateData.counters.filter(
            c => !department.counters.some(cnt => cnt.counterNumber === c)
        );

        if (invalidCounters.length > 0) {
            throw new ApiError(400, `Invalid counters: ${invalidCounters.join(", ")}`);
        }
    }

    // 📄 Validate required docs if included
    if (updateData.requiredDocs) {
        if (!Array.isArray(updateData.requiredDocs)) {
            throw new ApiError(400, "requiredDocs must be an array");
        }
        updateData.requiredDocs = updateData.requiredDocs.map(doc => ({
            name: doc.name,
            description: doc.description || "",
            isMandatory: doc.isMandatory ?? true,
        }));
    }

    // 🟩 Apply the updates safely
    Object.assign(service, {
        name: updateData.name ?? service.name,
        serviceCode: updateData.serviceCode ?? service.serviceCode,
        description: updateData.description ?? service.description,
        avgServiceTime: updateData.avgServiceTime ?? service.avgServiceTime,
        maxDailyServiceTokens: updateData.maxDailyServiceTokens ?? service.maxDailyServiceTokens,
        counters: updateData.counters ?? service.counters,
        priorityAllowed: updateData.priorityAllowed ?? service.priorityAllowed,
        requiredDocs: updateData.requiredDocs ?? service.requiredDocs,
    });

    await department.save();

    console.log(`📝 Service Updated: ${service.name} (${service.serviceCode})`);

    return res.status(200).json(
        new ApiResponse(200, service, "Service updated successfully")
    );
});










const deleteService = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const isAssignedAdmin = department.admins.some(
        id => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to delete service");
    }

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found");

    // Updated way to remove embedded subdocument
    department.services.pull(serviceId);
    // In latest Mongoose, service.remove() does not work on a subdocument instance anymore.

    await department.save();

    return res.status(200).json(
        new ApiResponse(200, service.name, "Service deleted successfully")
    );
});











const getServiceById = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;

    const department = await Department.findById(deptId).select("name services");
    if (!department) throw new ApiError(404, "Department not found");

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found");

    return res.status(200).json(
        new ApiResponse(200, service, "Service fetched successfully")
    );
});


















export {
    addService,
    updateService,
    deleteService,
    getServiceById,
};
