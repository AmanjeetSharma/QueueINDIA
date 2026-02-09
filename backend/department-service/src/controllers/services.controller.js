import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/Department.model.js";





// Add a new service to a department
const addService = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const {
        name,
        serviceCode,
        description,
        priorityAllowed = true,
        isDocumentUploadRequired = true,
        tokenManagement = {},
        requiredDocs = []
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

    // 🔁 Prevent duplicate serviceCode (case-insensitive)
    const uppercaseServiceCode = serviceCode.toUpperCase();
    if (department.services.some(s => s.serviceCode === uppercaseServiceCode)) {
        throw new ApiError(409, "Service with this code already exists in this department");
    }

    // 🟦 Build service object according to new schema
    const newService = {
        name,
        serviceCode: uppercaseServiceCode,
        description: description || "",
        priorityAllowed,
        isDocumentUploadRequired,
        tokenManagement: {
            maxDailyServiceTokens: tokenManagement.maxDailyServiceTokens || null,
            maxTokensPerSlot: tokenManagement.maxTokensPerSlot || 10,
            queueType: tokenManagement.queueType || "Hybrid",
            timeBtwEverySlot: tokenManagement.timeBtwEverySlot || 15,
            slotStartTime: tokenManagement.slotStartTime || "10:00",
            slotEndTime: tokenManagement.slotEndTime || "17:00",
            slotWindows: tokenManagement.slotWindows || []
        },
        requiredDocs: requiredDocs.map(doc => ({
            name: doc.name,
            description: doc.description || "",
            isMandatory: doc.isMandatory ?? true
        }))
    };

    department.services.push(newService);
    await department.save();

    const savedService = department.services[department.services.length - 1];

    console.log(`🆕 Service Added: ${savedService.name} (${savedService.serviceCode}) to ${department.name}`);

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
    if (updateData.serviceCode) {
        const uppercaseServiceCode = updateData.serviceCode.toUpperCase();
        if (uppercaseServiceCode !== service.serviceCode &&
            department.services.some(
                s => s.serviceCode === uppercaseServiceCode && s._id.toString() !== serviceId
            )) {
            throw new ApiError(409, "Another service already has this serviceCode");
        }
        updateData.serviceCode = uppercaseServiceCode;
    }

    // 📄 Validate and normalize requiredDocs if included
    if (updateData.requiredDocs) {
        if (!Array.isArray(updateData.requiredDocs)) {
            throw new ApiError(400, "requiredDocs must be an array");
        }
        updateData.requiredDocs = updateData.requiredDocs.map(doc => ({
            name: doc.name,
            description: doc.description || "",
            isMandatory: doc.isMandatory ?? true
        }));
    }

    // 🔄 Validate and normalize tokenManagement if included
    if (updateData.tokenManagement) {
        // Preserve existing values for missing fields
        const tokenMgmt = service.tokenManagement || {};
        updateData.tokenManagement = {
            maxDailyServiceTokens: updateData.tokenManagement.maxDailyServiceTokens ?? tokenMgmt.maxDailyServiceTokens ?? null,
            maxTokensPerSlot: updateData.tokenManagement.maxTokensPerSlot ?? tokenMgmt.maxTokensPerSlot ?? 10,
            queueType: updateData.tokenManagement.queueType ?? tokenMgmt.queueType ?? "Hybrid",
            timeBtwEverySlot: updateData.tokenManagement.timeBtwEverySlot ?? tokenMgmt.timeBtwEverySlot ?? 15,
            slotStartTime: updateData.tokenManagement.slotStartTime ?? tokenMgmt.slotStartTime ?? "10:00",
            slotEndTime: updateData.tokenManagement.slotEndTime ?? tokenMgmt.slotEndTime ?? "17:00",
            slotWindows: updateData.tokenManagement.slotWindows ?? tokenMgmt.slotWindows ?? []
        };
    }

    // 🟩 Apply the updates safely
    Object.assign(service, {
        name: updateData.name ?? service.name,
        serviceCode: updateData.serviceCode ?? service.serviceCode,
        description: updateData.description ?? service.description,
        priorityAllowed: updateData.priorityAllowed ?? service.priorityAllowed,
        isDocumentUploadRequired: updateData.isDocumentUploadRequired ?? service.isDocumentUploadRequired,
        tokenManagement: updateData.tokenManagement ?? service.tokenManagement,
        requiredDocs: updateData.requiredDocs ?? service.requiredDocs
    });

    await department.save();

    console.log(`📝 Service Updated: ${service.name} (${service.serviceCode}) in ${department.name}`);

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
