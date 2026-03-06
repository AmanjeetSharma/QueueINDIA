import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getLiveQueue,
    recallSkippedTokens,
    serveNextToken,
    completeToken,
    skipToken,
    getDepartmentServicesForQueue
} from "../controllers/queue.controller.js";

const router = express.Router();

// GET /queue/live
// @desc    Get live queue for department (serving + waiting)
// @access  Private (Officers/Admins)
router.get("/queue/live", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), getLiveQueue);

// POST /queue/tokens/recall-skipped
// @desc    Recall skipped tokens into waiting queue
// @access  Private (Officers/Admins)
router.post("/queue/tokens/recall-skipped", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), recallSkippedTokens);





// @desc    Serve next token
// @access  Private (Officers/Admins)
router.post("/queue/tokens/serve-next", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), serveNextToken);

// /queue/tokens/:tokenId/complete
router.post("/queue/tokens/:tokenId/complete", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), completeToken);

// /queue/tokens/:tokenId/skip
router.post("/queue/tokens/:tokenId/skip", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), skipToken);

// GET /queue/department-services?departmentId=xxxxx
router.get("/queue/department-services", verifyToken, authorizeRoles("SUPER_ADMIN", "DEPARTMENT_OFFICER", "ADMIN"), getDepartmentServicesForQueue);

export default router;