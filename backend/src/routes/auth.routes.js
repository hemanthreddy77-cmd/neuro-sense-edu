import { Router } from "express";
import { verifyToken, register, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/verify-token", verifyToken);
router.post("/register", register);

// Protected routes
router.get("/profile", verifyAuth, getProfile);
router.put("/profile", verifyAuth, updateProfile);

export default router;
