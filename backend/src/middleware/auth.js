import { auth, db, isFirebaseConfigured } from "../config/firebase.js";

/**
 * Authentication Middleware:
 * Verifies Firebase JWT ID token from Authorization header.
 * Attaches decoded user and Firestore profile to req.user.
 */
export async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or malformed Authorization header with Bearer token.",
      });
    }

    const token = authHeader.split("Bearer ")[1].trim();

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Bearer token is empty.",
      });
    }

    // 1. Production verification with Firebase Admin SDK
    if (isFirebaseConfigured && auth) {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        let userDoc = null;

        if (db) {
          const docSnap = await db.collection("users").doc(decodedToken.uid).get();
          if (docSnap.exists) {
            userDoc = docSnap.data();
          }
        }

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || userDoc?.email || "",
          name: decodedToken.name || userDoc?.name || "User",
          role: userDoc?.role || decodedToken.role || "student",
          ...userDoc,
        };

        return next();
      } catch (fbError) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid or expired Firebase ID token.",
          details: fbError.message,
        });
      }
    }

    // 2. Development fallback mode when Firebase Admin keys are not yet configured
    if (token.startsWith("mock-token-") || process.env.NODE_ENV === "development") {
      // Decode simulated user from header or provide default dev payload
      const isMockAdmin = token.toLowerCase().includes("admin");
      req.user = {
        uid: token.replace("mock-token-", "") || "mock-user-123",
        email: isMockAdmin ? "admin@neurolearn.ai" : "learner@neurolearn.ai",
        name: isMockAdmin ? "Admin User" : "Dev Learner",
        role: isMockAdmin ? "admin" : "student",
        enrolledCourses: ["c1", "c2"],
      };
      return next();
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Firebase credentials not configured and token is invalid.",
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to authenticate request.",
    });
  }
}

export { verifyAuth as authenticate };
