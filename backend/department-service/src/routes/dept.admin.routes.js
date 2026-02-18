import express from "express";
import { assignStaffToDepartment, removeStaff, getDepartmentStaff, updateStaffRole, removeStaffByUserId } from "../controllers/admins.controller.js";
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

// Remove staff by userId (user service will call this when a user's role is changed by SUPER_ADMIN)
router.patch("/remove-staff-by-user/:userId", verifyToken, authorizeRoles("SUPER_ADMIN"), removeStaffByUserId);

export default router;