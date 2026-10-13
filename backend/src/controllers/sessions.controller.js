import { db, isFirebaseConfigured } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { sendSessionSummaryEmail } from "../services/email.service.js";
import { devCourses } from "./courses.controller.js";

// In-memory development sessions
const devSessions = new Map([
  [
    "s1",
    {
      id: "s1",
      userId: "u_student1",
      courseId: "c1",
      courseTitle: "Modern Programming Foundations",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: 3300, // 55 mins
      dominantEmotion: "focused",
      emotionLogs: [
        { emotion: "focused", confidence: 0.88, timestamp: new Date(Date.now() - 3000000).toISOString(), contentAdapted: false },
        { emotion: "happy", confidence: 0.92, timestamp: new Date(Date.now() - 1500000).toISOString(), contentAdapted: false },
      ],
      status: "Completed",
    },
  ],
]);

/**
 * POST /api/sessions/start
 * Initialize a new learning session
 */
export async function startSession(req, res) {
  try {
    const { courseId } = req.body;
    const { uid } = req.user;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required to start a session" });
    }

    const sessionId = `s_${uuidv4().slice(0, 8)}`;
    const sessionData = {
      id: sessionId,
      userId: uid,
      courseId,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      dominantEmotion: "focused",
      emotionLogs: [],
      status: "In Progress",
    };

    if (isFirebaseConfigured && db) {
      await db.collection("sessions").doc(sessionId).set(sessionData);
    } else {
      devSessions.set(sessionId, sessionData);
    }

    return res.status(201).json({
      success: true,
      message: "Session started",
      session: sessionData,
    });
  } catch (error) {
    console.error("startSession error:", error);
    return res.status(500).json({ error: "Failed to start session", details: error.message });
  }
}

/**
 * PUT /api/sessions/:id/end
 * End learning session, compute duration, dominant emotion, and trigger summary email
 */
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const { dominantEmotion, duration } = req.body;
    const endTime = new Date().toISOString();

    let session = null;

    if (isFirebaseConfigured && db) {
      const ref = db.collection("sessions").doc(id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: "Session not found" });

      const data = doc.data();
      const calculatedDuration =
        duration ||
        (data.startTime ? Math.round((new Date(endTime) - new Date(data.startTime)) / 1000) : 0);

      // Determine dominant emotion from logs if not explicitly passed
      const finalDominant = dominantEmotion || data.dominantEmotion || "focused";

      const updates = {
        endTime,
        duration: calculatedDuration,
        dominantEmotion: finalDominant,
        status: "Completed",
      };

      await ref.update(updates);
      session = { ...data, ...updates };
    } else {
      session = devSessions.get(id);
      if (!session) return res.status(404).json({ error: "Session not found" });

      const calculatedDuration =
        duration ||
        (session.startTime ? Math.round((new Date(endTime) - new Date(session.startTime)) / 1000) : 1800);

      session.endTime = endTime;
      session.duration = calculatedDuration;
      session.dominantEmotion = dominantEmotion || session.dominantEmotion || "focused";
      session.status = "Completed";
      devSessions.set(id, session);
    }

    // Lookup course title for the email
    let courseTitle = "Adaptive Learning Track";
    if (session.courseId) {
      const course = devCourses.get(session.courseId);
      if (course) courseTitle = course.title;
    }

    // Send summary email asynchronously
    if (req.user?.email) {
      sendSessionSummaryEmail(req.user.email, req.user.name, {
        duration: session.duration,
        dominantEmotion: session.dominantEmotion,
        courseTitle,
      }).catch((err) => console.error("Session email error:", err));
    }

    return res.json({
      success: true,
      message: "Session ended successfully",
      session,
    });
  } catch (error) {
    console.error("endSession error:", error);
    return res.status(500).json({ error: "Failed to end session", details: error.message });
  }
}

/**
 * GET /api/sessions/my
 * Get all sessions belonging to currently authenticated user
 */
export async function getMySessions(req, res) {
  try {
    const { uid } = req.user;

    if (isFirebaseConfigured && db) {
      const snapshot = await db
        .collection("sessions")
        .where("userId", "==", uid)
        .orderBy("startTime", "desc")
        .get();

      const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, count: sessions.length, sessions });
    }

    const sessions = Array.from(devSessions.values()).filter((s) => s.userId === uid);
    return res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    console.error("getMySessions error:", error);
    return res.status(500).json({ error: "Failed to fetch user sessions", details: error.message });
  }
}

/**
 * GET /api/sessions/:id
 * Get single session details and full emotion log history
 */
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    if (isFirebaseConfigured && db) {
      const doc = await db.collection("sessions").doc(id).get();
      if (!doc.exists) return res.status(404).json({ error: "Session not found" });

      const session = { id: doc.id, ...doc.data() };

      // Also fetch emotion logs linked to this session
      const logsSnap = await db
        .collection("emotionLogs")
        .where("sessionId", "==", id)
        .orderBy("timestamp", "asc")
        .get();

      session.emotionLogs = logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      return res.json({ success: true, session });
    }

    const session = devSessions.get(id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    return res.json({ success: true, session });
  } catch (error) {
    console.error("getSessionById error:", error);
    return res.status(500).json({ error: "Failed to fetch session", details: error.message });
  }
}

export { devSessions };
