import { Router } from "express";
import {
  startSession,
  endSession,
  getMySessions,
  getSessionById,
} from "../controllers/sessions.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router();

// All session routes require authenticated user
router.use(verifyAuth);

router.post("/start", startSession);
router.put("/:id/end", endSession);
router.get("/my", getMySessions);
router.get("/:id", getSessionById);

export default router;
