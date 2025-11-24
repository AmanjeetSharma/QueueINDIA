import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    addService,
    getServiceById,
    updateService,
    deleteService
} from "../controllers/services.controller.js";

const router = express.Router();

// Service CRUD inside Department (Embedded)
router.post("/:deptId/services", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), addService);

router.patch("/:deptId/services/:serviceId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateService);

router.delete("/:deptId/services/:serviceId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), deleteService);

router.get("/:deptId/services/:serviceId", getServiceById);

export default router;
