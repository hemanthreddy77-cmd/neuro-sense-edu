import { Router } from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminStats,
} from "../controllers/admin.controller.js";
import { verifyAuth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyAuth, adminOnly);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/stats", getAdminStats);

export default router;
