import express from "express";
import {
    getDepartmentBookings,
    getBookingDetailsForOfficer,
    approveBooking,
    rejectBooking,
    rejectDocument,
    cancelBooking,
    completeBooking
} from "../controllers/departmentOfficer.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// For getting all bookings for the department (officer can see all bookings of their department)
router.get("/bookings", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), getDepartmentBookings);

// For getting details of a specific booking (officer can only access bookings of their department)
router.get("/bookings/:bookingId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), getBookingDetailsForOfficer);






// For approving a booking (officer can only approve bookings of their department)
router.post("/bookings/:bookingId/docs/:docId/approve", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), approveBooking);

// For rejecting a document (officer can only reject documents of bookings of their department)
router.post("/bookings/:bookingId/docs/:docId/reject", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), rejectDocument);

// For rejecting a booking (officer can only reject bookings of their department)
router.post("/bookings/:bookingId/reject", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), rejectBooking);



// For completing a booking (officer can only complete bookings of their department)
router.post("/bookings/:bookingId/complete", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), completeBooking);

// For canceling a booking (officer can only cancel bookings of their department)
router.post("/bookings/:bookingId/cancel", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN", "DEPARTMENT_OFFICER"), cancelBooking);


export default router;
