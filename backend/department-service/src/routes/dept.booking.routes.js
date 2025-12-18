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

// Admin routes for booking management
router.get("/admin/bookings", verifyToken, authorizeRoles(["SUPER_ADMIN", "DEPARTMENT_ADMIN"]), async (req, res) => {
    // Admin booking management logic
});

export default router;





// import express from "express";
// import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
// import { getWorkingDays, getAvailableSlots, createBooking, } from "../controllers/booking.controller.js";
// import { getDocumentRequirements, uploadDocuments } from "../controllers/document.controller.js";

// const router = express.Router();






// router.get("/:deptId/booking/dates", verifyToken, getWorkingDays);

// router.get("/:deptId/booking/:serviceId/slots", verifyToken, getAvailableSlots);

// router.post("/:deptId/booking/:serviceId/book", verifyToken, createBooking);


// router.get("/:deptId/booking/:bookingId/documents/requirements", verifyToken, getDocumentRequirements);

// router.post("/:deptId/booking/:bookingId/documents/upload", verifyToken, uploadDocuments);


// export default router;
