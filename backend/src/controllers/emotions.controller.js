import { db, isFirebaseConfigured } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { devSessions } from "./sessions.controller.js";

// In-memory development logs
const devEmotionLogs = [];

/**
 * POST /api/emotions/log
 * Save an emotion detection event from the frontend camera stream
 */
export async function logEmotion(req, res) {
  try {
    const { sessionId, emotion, confidence, timestamp, contentAdapted } = req.body;
    const userId = req.user?.uid || req.body.userId || "anonymous";

    if (!sessionId || !emotion) {
      return res.status(400).json({ error: "sessionId and emotion are required" });
    }

    const logEntry = {
      id: `log_${uuidv4().slice(0, 8)}`,
      sessionId,
      userId,
      emotion: emotion.toLowerCase(),
      confidence: typeof confidence === "number" ? confidence : 0.85,
      timestamp: timestamp || new Date().toISOString(),
      contentAdapted: Boolean(contentAdapted),
    };

    if (isFirebaseConfigured && db) {
      // 1. Insert into emotionLogs collection
      await db.collection("emotionLogs").doc(logEntry.id).set(logEntry);

      // 2. Append to session's emotionLogs array if session exists
      const sessionRef = db.collection("sessions").doc(sessionId);
      const sessionDoc = await sessionRef.get();
      if (sessionDoc.exists) {
        const existingLogs = sessionDoc.data().emotionLogs || [];
        existingLogs.push({
          emotion: logEntry.emotion,
          confidence: logEntry.confidence,
          timestamp: logEntry.timestamp,
          contentAdapted: logEntry.contentAdapted,
        });
        await sessionRef.update({
          emotionLogs: existingLogs,
          dominantEmotion: logEntry.emotion,
        });
      }
    } else {
      devEmotionLogs.push(logEntry);
      const session = devSessions.get(sessionId);
      if (session) {
        session.emotionLogs = session.emotionLogs || [];
        session.emotionLogs.push(logEntry);
        session.dominantEmotion = logEntry.emotion;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Emotion logged successfully",
      log: logEntry,
    });
  } catch (error) {
    console.error("logEmotion error:", error);
    return res.status(500).json({ error: "Failed to log emotion", details: error.message });
  }
}

/**
 * GET /api/emotions/stats/:userId
 * Aggregate emotion statistics for user analytics dashboard
 */
export async function getEmotionStats(req, res) {
  try {
    const { userId } = req.params;

    let logs = [];

    if (isFirebaseConfigured && db) {
      const snap = await db.collection("emotionLogs").where("userId", "==", userId).get();
      logs = snap.docs.map((d) => d.data());
    } else {
      logs = devEmotionLogs.filter((l) => l.userId === userId);
      // If dev user has no logs yet, provide representative seed analytics
      if (logs.length === 0) {
        logs = [
          { emotion: "focused", confidence: 0.85, timestamp: new Date().toISOString() },
          { emotion: "focused", confidence: 0.88, timestamp: new Date().toISOString() },
          { emotion: "happy", confidence: 0.90, timestamp: new Date().toISOString() },
          { emotion: "confused", confidence: 0.72, timestamp: new Date().toISOString() },
          { emotion: "curious", confidence: 0.81, timestamp: new Date().toISOString() },
        ];
      }
    }

    // 1. Calculate emotion frequencies
    const counts = {};
    for (const item of logs) {
      const em = item.emotion || "neutral";
      counts[em] = (counts[em] || 0) + 1;
    }

    // 2. Identify dominant emotion
    let dominantEmotion = "focused";
    let maxCount = 0;
    for (const [em, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = em;
      }
    }

    // 3. Build time-series trend data
    const totalCount = logs.length;
    const distribution = Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      key: name,
      count: value,
      percentage: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0,
    }));

    return res.json({
      success: true,
      userId,
      totalEvents: totalCount,
      dominantEmotion,
      counts,
      distribution,
    });
  } catch (error) {
    console.error("getEmotionStats error:", error);
    return res.status(500).json({ error: "Failed to fetch emotion stats", details: error.message });
  }
}
