import { db, auth, isFirebaseConfigured } from "../config/firebase.js";
import { sendWelcomeEmail } from "../services/email.service.js";

// In-memory development store when Firebase is not connected
const devUsers = new Map([
  [
    "u_student1",
    {
      uid: "u_student1",
      name: "Aarav Mehta",
      email: "aarav@neurolearn.ai",
      role: "student",
      createdAt: new Date().toISOString(),
      enrolledCourses: ["c1", "c2"],
    },
  ],
  [
    "u_admin1",
    {
      uid: "u_admin1",
      name: "Sofia Hernández",
      email: "admin@neurolearn.ai",
      role: "admin",
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
    },
  ],
]);

/**
 * POST /api/auth/verify-token
 * Verify Firebase ID token and return user profile
 */
export async function verifyToken(req, res) {
  try {
    const idToken = req.body.idToken || req.headers.authorization?.replace("Bearer ", "");

    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }

    if (isFirebaseConfigured && auth) {
      const decoded = await auth.verifyIdToken(idToken);
      let userProfile = null;

      if (db) {
        const userDoc = await db.collection("users").doc(decoded.uid).get();
        if (userDoc.exists) {
          userProfile = userDoc.data();
        } else {
          // Auto-provision initial record
          userProfile = {
            uid: decoded.uid,
            name: decoded.name || decoded.email?.split("@")[0] || "Learner",
            email: decoded.email || "",
            role: decoded.email?.includes("admin") ? "admin" : "student",
            createdAt: new Date().toISOString(),
            enrolledCourses: [],
          };
          await db.collection("users").doc(decoded.uid).set(userProfile);
        }
      }

      return res.json({
        success: true,
        user: userProfile || { uid: decoded.uid, email: decoded.email, role: "student" },
      });
    }

    // Dev fallback
    const mockUid = idToken.startsWith("mock-token-") ? idToken.replace("mock-token-", "") : "u_student1";
    let user = devUsers.get(mockUid);
    if (!user) {
      user = {
        uid: mockUid,
        name: "Dev Learner",
        email: "dev@neurolearn.ai",
        role: mockUid.includes("admin") ? "admin" : "student",
        createdAt: new Date().toISOString(),
        enrolledCourses: ["c1"],
      };
      devUsers.set(mockUid, user);
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json({ error: "Invalid token", details: error.message });
  }
}

/**
 * POST /api/auth/register
 * Create user document in Firestore after Firebase signup
 */
export async function register(req, res) {
  try {
    const { uid, name, email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userId = uid || `u_${Math.random().toString(36).slice(2, 9)}`;
    const userRole = role === "admin" ? "admin" : "student";

    const userData = {
      uid: userId,
      name: name || email.split("@")[0],
      email,
      role: userRole,
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
    };

    if (isFirebaseConfigured && db) {
      await db.collection("users").doc(userId).set(userData);
    } else {
      devUsers.set(userId, userData);
    }

    // Trigger asynchronous welcome email
    sendWelcomeEmail(email, userData.name).catch((err) =>
      console.error("Background welcome email error:", err)
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ error: "Failed to register user", details: error.message });
  }
}

/**
 * GET /api/auth/profile
 * Get current authenticated user profile
 */
export async function getProfile(req, res) {
  try {
    const { uid } = req.user;

    if (isFirebaseConfigured && db) {
      const doc = await db.collection("users").doc(uid).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "User profile not found in Firestore" });
      }
      return res.json({ success: true, user: doc.data() });
    }

    const user = devUsers.get(uid) || req.user;
    return res.json({ success: true, user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
}

/**
 * PUT /api/auth/profile
 * Update authenticated user profile
 */
export async function updateProfile(req, res) {
  try {
    const { uid } = req.user;
    const { name, avatarUrl } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    updates.updatedAt = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      const userRef = db.collection("users").doc(uid);
      await userRef.update(updates);
      const updated = await userRef.get();
      return res.json({ success: true, user: updated.data() });
    }

    const current = devUsers.get(uid) || req.user;
    const updated = { ...current, ...updates };
    devUsers.set(uid, updated);

    return res.json({ success: true, user: updated });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
}

export { devUsers };
