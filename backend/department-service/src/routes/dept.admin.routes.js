import express from "express";
import { assignAdminToDepartment, removeSelfFromAdmins, removeAdminBySuperAdmin, getDepartmentStaff } from "../controllers/admins.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get admins by department
router.get("/:deptId/admins", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getDepartmentStaff);

// Add admin to a department
router.post("/:deptId/admins", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), assignAdminToDepartment);

// Remove self from admin
router.delete("/:deptId/admins/self", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), removeSelfFromAdmins);

// Remove admin by super admin
router.delete("/:deptId/admins/:adminId", verifyToken, authorizeRoles("SUPER_ADMIN"), removeAdminBySuperAdmin);


export default router;