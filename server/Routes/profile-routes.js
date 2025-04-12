import express from "express";
import { changePassword, updateUserProfile, getUserProfile } from "../Controllers/profile-controller.js";
import { authMiddleware } from "../Middleware/auth.js";

const router = express.Router();

router.post("/change-password", authMiddleware, changePassword);
router.post("/update-profile", authMiddleware, updateUserProfile);
router.get("/show-profile", authMiddleware, getUserProfile);

export default router;
