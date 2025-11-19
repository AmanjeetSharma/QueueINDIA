import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    addService,
    updateService,
    deleteService,
    getDepartmentServices
} from "../controllers/service.controller.js";

const router = express.Router();

// Add Service ➜ ADMIN / SUPER_ADMIN
router.post("/:deptId/services", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), addService);

// Update Service ➜ ADMIN / SUPER_ADMIN
router.patch("/:deptId/services/:serviceId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateService);

// Delete Service ➜ ADMIN / SUPER_ADMIN
router.delete("/:deptId/services/:serviceId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), deleteService);

// Public — Get Services List
router.get("/:deptId/services", getDepartmentServices);

// Get services by department ID ➜ PUBLIC
router.get("/:deptId/services/:serviceId", getServiceById);

export default router;
