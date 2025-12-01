import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getWorkingDays, getAvailableSlots } from "../controllers/booking.controller.js";

const router = express.Router();

// Step 1 → Available Dates
router.get("/:deptId/booking/dates", verifyToken, getWorkingDays);

// Step 2 → Available Slots per Date + Service
router.get("/:deptId/booking/:serviceId/slots", verifyToken, getAvailableSlots);

export default router;
