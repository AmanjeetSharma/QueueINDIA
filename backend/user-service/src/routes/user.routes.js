import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { sendVerificationEmail, verifyEmail } from "../controllers/user.controller.js";
import {
    updateProfile,
    changePassword,
    deleteAccount,
    listUserSessions,
    addPhone,
    verifyPhone,
    addSecondaryEmail,
    verifySecondaryEmail,
    updateDOB,
} from "../controllers/user.controller.js";

import {
    getAllUsers,
    forceLogoutUser,
    resetUserPasswordAdmin,
    changeUserRole,
    deleteUserByAdmin
} from "../controllers/user.admin.controller.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.patch("/update-profile", verifyToken, upload.fields([{ name: "avatar", maxCount: 1 }]), updateProfile);
router.patch("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);
router.get("/sessions", verifyToken, listUserSessions);
router.patch("/update-dob", verifyToken, updateDOB);

// Phone number routes
router.post("/phone/add", verifyToken, addPhone);
router.post("/phone/verify", verifyToken, verifyPhone);

// Primary email verification routes
router.post("/send-verification/:userId", verifyToken, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

// secondary email (NEW)
router.post("/email/add-secondary", verifyToken, addSecondaryEmail);
router.post("/email/verify-secondary", verifyToken, verifySecondaryEmail);

// Super Admin routes
router.get("/admin/all-users", verifyToken, authorizeRoles("SUPER_ADMIN"), getAllUsers);
router.route("/admin/:userId/force-logout").post(verifyToken, authorizeRoles("SUPER_ADMIN"), forceLogoutUser);
router.route("/admin/:userId/reset-password").post(verifyToken, authorizeRoles("SUPER_ADMIN"), resetUserPasswordAdmin);
router.route("/admin/:userId/change-role").patch(verifyToken, authorizeRoles("SUPER_ADMIN"), changeUserRole);
router.route("/admin/:userId/delete-user").delete(verifyToken, authorizeRoles("SUPER_ADMIN"), deleteUserByAdmin);

export default router;
