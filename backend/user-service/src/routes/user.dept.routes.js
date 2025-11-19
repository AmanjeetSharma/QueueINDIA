import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { findUserByEmail, bulkFetchUsers } from "../controllers/user.dept.controller.js";

const router = express.Router();

// Find user by email
router.get("/find-by-email", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), findUserByEmail);

// Bulk fetch users by IDs
router.post("/bulk", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), bulkFetchUsers);

export default router;