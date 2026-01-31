// routes/department.routes.js
import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createDepartment, updateDepartment, getDepartments, deleteDepartment, getDepartmentById } from "../controllers/department.controller.js";
import { checkDeptScope } from "../middlewares/checkDeptScope.middleware.js";// ownership check 

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("SUPER_ADMIN"), createDepartment);

router.patch("/update/:deptId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), checkDeptScope, updateDepartment);

router.delete("/delete/:deptId", verifyToken, authorizeRoles("SUPER_ADMIN"), deleteDepartment);

router.get("/all-departments", getDepartments);

router.get("/department/:deptId", getDepartmentById);

export default router;