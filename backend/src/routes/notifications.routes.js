import { Router } from "express";
import {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  getPreferences,
  updatePreferences,
  sendTestNotification,
  triggerEventNotification,
} from "../controllers/notification.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router();

// Middleware to optionally attach user if Authorization Bearer header is present
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return verifyAuth(req, res, next);
  }
  next();
};

// Public VAPID key
router.get("/vapid-public-key", getVapidPublicKey);

// Subscription management (optional auth so guests can also subscribe on mobile/PWA)
router.post("/subscribe", optionalAuth, subscribe);
router.post("/unsubscribe", optionalAuth, unsubscribe);

// Preferences
router.get("/preferences", optionalAuth, getPreferences);
router.put("/preferences", optionalAuth, updatePreferences);

// Testing & Triggering
router.post("/test", optionalAuth, sendTestNotification);
router.post("/trigger", optionalAuth, triggerEventNotification);

export default router;
