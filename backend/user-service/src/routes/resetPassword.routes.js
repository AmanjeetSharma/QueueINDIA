import express from "express";
import {
    forgotPassword,
    resetPassword,
    requestPhonePasswordReset,
    resetPasswordWithPhone
} from "../controllers/password.controller.js";

const router = express.Router();


// Password reset via email
router.post("/forgot-password-email", forgotPassword);
router.post("/reset-password-email", resetPassword);

// Password reset via phone
router.post("/forgot-password-phone", requestPhonePasswordReset);
router.post("/reset-password-phone", resetPasswordWithPhone);

export default router;