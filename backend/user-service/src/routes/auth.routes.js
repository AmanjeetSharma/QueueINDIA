import express from "express";
import { register, login, refresh, logout, logoutAllDevices } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }]), register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/logout-all", verifyToken, logoutAllDevices);
router.post("/refresh-token", refresh);

export default router;
