import express from "express";
import { assignStaffToDepartment, removeStaff, getDepartmentStaff, updateStaffRole } from "../controllers/admins.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get staff of department
router.get("/:deptId/admins", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getDepartmentStaff);

// Add staff to department
router.post("/:deptId/assign-admin", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), assignStaffToDepartment);

// Update staff role in a department
router.put("/:deptId/admins/:userId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateStaffRole);

// Remove staff
router.delete("/:deptId/admins/:userId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), removeStaff);


export default router;