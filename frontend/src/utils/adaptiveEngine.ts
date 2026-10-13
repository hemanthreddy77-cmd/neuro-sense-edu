/**
 * Adaptive Content Engine
 * Implements real-time learning loop adaptation based on facial emotion classification.
 */

export type EmotionType =
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised"
  | "neutral"
  | "focused"
  | "confused"
  | "bored"
  | "curious"
  | "motivated";

export type AdaptationResult = {
  action:
    "SIMPLER_CONTENT" | "INTERACTIVE_CONTENT" | "CONTINUE" | "BREAK_RECOMMENDED" | "DEEP_DIVE";
  bannerTitle: string;
  bannerDescription: string;
  badgeIntent: "good" | "warn" | "bad";
  contentAdapted: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Computes pedagogical adaptation based on emotion state
 */
export function evaluateEmotionAdaptation(emotion: EmotionType): AdaptationResult {
  const norm = emotion.toLowerCase() as EmotionType;

  // 1. Confusion or Disgust -> Simpler explanation
  if (norm === "disgusted" || norm === "confused") {
    return {
      action: "SIMPLER_CONTENT",
      bannerTitle: "Showing simpler explanation…",
      bannerDescription:
        "We noticed some hesitation. Breaking this topic down with diagrams and a step-by-step mental model.",
      badgeIntent: "warn",
      contentAdapted: true,
    };
  }

  // 2. Neutral, Sad, or Bored -> Interactive / Video content
  if (norm === "neutral" || norm === "sad" || norm === "bored") {
    return {
      action: "INTERACTIVE_CONTENT",
      bannerTitle: "Switching to interactive content…",
      bannerDescription:
        "Energy dip detected. Switching to a short hands-on exercise to re-engage your attention.",
      badgeIntent: "warn",
      contentAdapted: true,
    };
  }

  // 3. Angry or Fearful -> Break recommendation
  if (norm === "angry" || norm === "fearful") {
    return {
      action: "BREAK_RECOMMENDED",
      bannerTitle: "Taking a short break recommended",
      bannerDescription:
        "High cognitive strain detected. Stepping away for a 2-minute break boosts long-term retention.",
      badgeIntent: "bad",
      contentAdapted: true,
    };
  }

  // 4. Happy or Surprised -> Continue current flow
  if (norm === "happy" || norm === "surprised") {
    return {
      action: "CONTINUE",
      bannerTitle: "Great vibe! Continuing at this pace…",
      bannerDescription: "You're enjoying this concept — keeping up the positive momentum.",
      badgeIntent: "good",
      contentAdapted: false,
    };
  }

  // 5. Focused or Motivated -> Deep dive
  return {
    action: "DEEP_DIVE",
    bannerTitle: "Great focus! Continuing…",
    bannerDescription:
      "Deep focus state active. Advancing content challenge and surfacing key takeaways.",
    badgeIntent: "good",
    contentAdapted: false,
  };
}

/**
 * Logs emotion detection event and adaptation outcome to the backend API
 */
export async function logEmotionDetection({
  sessionId,
  userId,
  emotion,
  confidence,
  contentAdapted,
}: {
  sessionId: string;
  userId?: string;
  emotion: EmotionType;
  confidence: number;
  contentAdapted: boolean;
}) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("firebase_id_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/emotions/log`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sessionId,
        userId: userId || "anonymous",
        emotion,
        confidence,
        timestamp: new Date().toISOString(),
        contentAdapted,
      }),
    });

    if (!res.ok) {
      console.warn("Failed to log emotion to backend:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    // Non-blocking telemetry failure
    console.debug("Backend emotion logging skipped (offline/unreachable):", error);
    return null;
  }
}
