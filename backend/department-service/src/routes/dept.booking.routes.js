import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getWorkingDays,
    getAvailableSlots,
    createBooking,
    // getUserBookings,
    // getBookingById,
    // updateBookingStatus,
    // cancelBooking,
    // uploadBookingDocuments,
    // getDepartmentBookings
} from "../controllers/booking.controller.js";

const router = express.Router();






// Step 1 → Get available working days for a department
router.get("/:deptId/booking/dates", verifyToken, getWorkingDays);

// Step 2 → Get available slots for a specific service and date
router.get("/:deptId/booking/:serviceId/slots", verifyToken, getAvailableSlots);

// Step 3 → Create a new booking
router.post("/:deptId/booking/:serviceId/book", verifyToken, createBooking);

// // Step 4 → Upload documents for a booking
// router.post("/:bookingId/documents", verifyToken, uploadBookingDocuments);

// // ==================== USER BOOKING MANAGEMENT ====================

// // Get all bookings for the logged-in user
// router.get("/my-bookings", verifyToken, getUserBookings);

// // Get specific booking details
// router.get("/booking/:bookingId", verifyToken, getBookingById);

// // Cancel a booking (user can cancel before approval)
// router.patch("/booking/:bookingId/cancel", verifyToken, cancelBooking);

// // ==================== DEPARTMENT ADMIN ENDPOINTS ====================

// // Get all bookings for a department (Department Admin + SUPER_ADMIN)
// router.get(
//     "/department/:deptId/bookings",
//     verifyToken,
//     authorizeRoles(["SUPER_ADMIN", "DEPARTMENT_ADMIN"]),
//     getDepartmentBookings
// );

// // Update booking status (Department Admin + SUPER_ADMIN)
// router.patch(
//     "/booking/:bookingId/status",
//     verifyToken,
//     authorizeRoles(["SUPER_ADMIN", "DEPARTMENT_ADMIN"]),
//     updateBookingStatus
// );

// // ==================== SUPER ADMIN ENDPOINTS ====================

// // Get all bookings across all departments (SUPER_ADMIN only)
// router.get(
//     "/admin/all-bookings",
//     verifyToken,
//     authorizeRoles(["SUPER_ADMIN"]),
//     async (req, res) => {
//         // This would be handled by a separate controller
//         res.json({ message: "All bookings endpoint" });
//     }
// );

export default router;