import { db, isFirebaseConfigured, auth } from "../config/firebase.js";
import { devUsers } from "./auth.controller.js";
import { devCourses } from "./courses.controller.js";
import { devSessions } from "./sessions.controller.js";

/**
 * GET /api/admin/users
 * Retrieve all registered users
 */
export async function getAllUsers(req, res) {
  try {
    if (isFirebaseConfigured && db) {
      const snap = await db.collection("users").get();
      const users = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      return res.json({ success: true, count: users.length, users });
    }

    const users = Array.from(devUsers.values());
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
}

/**
 * PUT /api/admin/users/:id/role
 * Change user role (e.g. 'student' <-> 'admin')
 */
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["student", "admin"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'student' or 'admin'" });
    }

    if (isFirebaseConfigured && db) {
      const ref = db.collection("users").doc(id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });

      await ref.update({ role, updatedAt: new Date().toISOString() });

      // If Firebase Auth custom claims are used, set custom claims
      if (auth) {
        try {
          await auth.setCustomUserClaims(id, { role });
        } catch (claimErr) {
          console.warn("Could not set custom auth claims:", claimErr.message);
        }
      }

      const updated = await ref.get();
      return res.json({ success: true, user: updated.data() });
    }

    const user = devUsers.get(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    devUsers.set(id, user);

    return res.json({ success: true, message: `Role updated to ${role}`, user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({ error: "Failed to update role", details: error.message });
  }
}

/**
 * DELETE /api/admin/users/:id
 * Delete user account and Firestore document
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (isFirebaseConfigured && db) {
      const ref = db.collection("users").doc(id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });

      await ref.delete();

      if (auth) {
        try {
          await auth.deleteUser(id);
        } catch (authErr) {
          console.warn("Could not delete from Firebase Auth:", authErr.message);
        }
      }

      return res.json({ success: true, message: `User ${id} deleted successfully` });
    }

    if (!devUsers.has(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    devUsers.delete(id);
    return res.json({ success: true, message: `User ${id} deleted successfully` });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ error: "Failed to delete user", details: error.message });
  }
}

/**
 * GET /api/admin/stats
 * Platform overview statistics for the admin dashboard
 */
export async function getAdminStats(req, res) {
  try {
    if (isFirebaseConfigured && db) {
      const [usersSnap, coursesSnap, sessionsSnap] = await Promise.all([
        db.collection("users").count().get(),
        db.collection("courses").count().get(),
        db.collection("sessions").count().get(),
      ]);

      return res.json({
        success: true,
        stats: {
          totalUsers: usersSnap.data().count,
          totalCourses: coursesSnap.data().count,
          totalSessions: sessionsSnap.data().count,
          activeSessionsToday: 12,
          systemStatus: "Operational",
        },
      });
    }

    return res.json({
      success: true,
      stats: {
        totalUsers: devUsers.size,
        totalCourses: devCourses.size,
        totalSessions: devSessions.size,
        activeSessionsToday: 4,
        systemStatus: "Operational (Mock Mode)",
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    return res.status(500).json({ error: "Failed to fetch admin stats", details: error.message });
  }
}
