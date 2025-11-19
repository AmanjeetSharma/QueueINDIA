import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    updateTokenConfig,
    bookToken,
    updateTokenStatus,
    getQueueStatus
} from "../controllers/token.controller.js";

const router = express.Router({ mergeParams: true });

// Update Token Config ➜ ADMIN / SUPER_ADMIN
router.patch("/:deptId/token-config", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateTokenConfig);

// Token Booking ➜ USER
router.post("/:deptId/book-token", verifyToken, authorizeRoles("USER"), bookToken);

// Update Token Status ➜ Officer / Admin
router.patch("/:deptId/tokens/:tokenId/status", verifyToken, authorizeRoles("DEPARTMENT_OFFICER", "ADMIN"), updateTokenStatus);

// Live Queue Status ➜ Public
router.get("/:deptId/queue-status", getQueueStatus);

export default router;
