import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} from "../controllers/courses.controller.js";
import { verifyAuth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();

// Public course viewing
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Protected student enrollment
router.post("/:id/enroll", verifyAuth, enrollCourse);

// Admin-only management
router.post("/", verifyAuth, adminOnly, createCourse);
router.put("/:id", verifyAuth, adminOnly, updateCourse);
router.delete("/:id", verifyAuth, adminOnly, deleteCourse);

export default router;
