import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    addRating,
    updateRating,
    deleteRating,
    getRatings
} from "../controllers/rating.controller.js";

const router = express.Router({ mergeParams: true });

// Add Rating ➜ USER
router.post("/:deptId/ratings", verifyToken, authorizeRoles("USER"), addRating);

// Update Rating ➜ USER
router.patch("/:deptId/ratings/:ratingId", verifyToken, authorizeRoles("USER"), updateRating);

// Delete Rating ➜ ADMIN / SUPER_ADMIN
router.delete("/:deptId/ratings/:ratingId", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), deleteRating);

// Public → View Ratings
router.get("/:deptId/ratings", getRatings);

export default router;
