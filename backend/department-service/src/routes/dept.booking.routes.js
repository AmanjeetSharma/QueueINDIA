import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getWorkingDays,
    getAvailableSlots,
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
} from "../controllers/booking.controller.js";
import { uploadDocument } from "../controllers/document.controller.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";


const router = express.Router();

// Date and slot availability
router.get("/:deptId/booking/dates", verifyToken, getWorkingDays);
router.get("/:deptId/booking/:serviceId/slots", verifyToken, getAvailableSlots);

// Create booking
router.post("/:deptId/booking/:serviceId/book", verifyToken, createBooking);

// User bookings management
router.get("/bookings/user", verifyToken, getUserBookings);
router.get("/bookings/:bookingId", verifyToken, getBookingById);
router.post("/bookings/:bookingId/cancel", verifyToken, cancelBooking);

//Upload documents routes

router.post(
    "/bookings/:bookingId/documents/upload",
    verifyToken,
    uploadSingle("file"), // multer middleware
    uploadDocument
);

export default router;
