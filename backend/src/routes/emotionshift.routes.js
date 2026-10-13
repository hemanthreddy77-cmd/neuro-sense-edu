import { Router } from "express";
import {
  getCategories,
  getScenarios,
  getScenarioById,
  recordSession,
  getSessions,
  getRecommendations,
} from "../controllers/emotionshift.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/categories", getCategories);
router.get("/scenarios", getScenarios);
router.get("/scenarios/:id", getScenarioById);
router.post("/recommendations", getRecommendations);

// Session recording routes (graceful with dev/guest authentication)
router.post("/sessions", recordSession);
router.get("/sessions", getSessions);

export default router;
