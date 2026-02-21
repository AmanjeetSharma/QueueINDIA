import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validateTokenForDepartment, findUserByEmail, bulkFetchUsers, assignDepartmentToUser, removeDepartmentFromUser, updateUserDepartmentRole } from "../controllers/user.dept.controller.js";

const router = express.Router();

// Internal Validation Endpoint for department-service to verify and retrieve user info from token

router.get(
    "/validate-token-department",
    verifyToken,
    validateTokenForDepartment
);

// Find user by email
router.get("/find-by-email", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), findUserByEmail);

// Bulk fetch users by IDs
router.post("/bulk", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), bulkFetchUsers);

// Assigning Department Id to new staff
router.patch("/:userId/assign-department", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), assignDepartmentToUser);

// Removing Department Id & change role from staff to USER (unassigning from department)
router.patch("/:userId/remove-department", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), removeDepartmentFromUser);

// Update staff role within department (ADMIN <-> OFFICER)
router.patch("/:userId/update-department-role", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateUserDepartmentRole);

export default router;