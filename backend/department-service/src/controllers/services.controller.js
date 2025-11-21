import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";







const addService = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const { name, serviceCode, description, avgServiceTime } = req.body;

    if (!name || !serviceCode) {
        throw new ApiError(400, "name and serviceCode are required");
    }

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const isAssignedAdmin = department.admins.some(
        id => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to add service");
    }

    // Prevent duplicate code inside same department
    if (department.services.some(s => s.serviceCode === serviceCode)) {
        throw new ApiError(409, "Service with this code already exists in this department");
    }

    const newService = {
        name,
        serviceCode,
        description,
        avgServiceTime
    };

    department.services.push(newService);
    await department.save();

    return res.status(201).json(
        new ApiResponse(201, department.services[department.services.length - 1],
            "Service added successfully")
    );
});












const updateService = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;
    const updateData = req.body;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const isAssignedAdmin = department.admins.some(
        id => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== "SUPER_ADMIN" && !isAssignedAdmin) {
        throw new ApiError(403, "Not authorized to update service");
    }

    const service = department.services.id(serviceId);
    if (!service) throw new ApiError(404, "Service not found");

    Object.assign(service, updateData);

    await department.save();

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











const getServices = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    const department = await Department.findById(deptId).select("name services");
    if (!department) throw new ApiError(404, "Department not found");

    return res.status(200).json(
        new ApiResponse(200, {
            departmentName: department.name,
            services: department.services,
        }, "Services fetched successfully")
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
    getServices,
    getServiceById,
    updateService,
    deleteService
};
