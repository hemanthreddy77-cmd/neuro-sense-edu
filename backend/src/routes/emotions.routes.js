import { Router } from "express";
import { logEmotion, getEmotionStats } from "../controllers/emotions.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router();

// Log detection event (can be authenticated, or accepts userId in body)
router.post("/log", (req, res, next) => {
  // Allow logging even if user isn't authenticated yet, but attach req.user if token present
  if (req.headers.authorization) {
    return verifyAuth(req, res, next);
  }
  next();
}, logEmotion);

// Get emotion statistical trend
router.get("/stats/:userId", verifyAuth, getEmotionStats);

export default router;
