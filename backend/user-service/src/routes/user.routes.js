import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { updateProfile, changePassword, deleteAccount, listUserSessions, addPhone, verifyPhone, addSecondaryEmail, verifySecondaryEmail } from "../controllers/user.controller.js";
import { sendVerificationEmail, verifyEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.patch("/update-profile", verifyToken, upload.fields([{ name: "avatar", maxCount: 1 }]), updateProfile);
router.patch("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);
router.get("/sessions", verifyToken, listUserSessions);

// Phone number routes
router.post("/phone/add", verifyToken, addPhone);
router.post("/phone/verify", verifyToken, verifyPhone);

// Primary email verification routes
router.post("/send-verification/:userId", verifyToken, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

// secondary email (NEW)
router.post("/email/add-secondary", verifyToken, addSecondaryEmail);
router.post("/email/verify-secondary", verifyToken, verifySecondaryEmail);


export default router;
