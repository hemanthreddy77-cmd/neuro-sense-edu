import { v4 as uuidv4 } from "uuid";
import { db, isFirebaseConfigured } from "../config/firebase.js";

// In-memory sessions store for dev/offline mode
const devEmotionShiftSessions = [];

const CATEGORIES = [
  {
    id: "cat-1",
    slug: "relax-reset",
    title: "Relax & Reset",
    description: "Slow down, take a breath, and explore calming experiences at your own pace.",
    cta: "Explore Calm Experiences",
    examples: ["Guided breathing", "Grounding exercises", "Peaceful scenes"],
    accentColor: "oklch(0.72 0.12 260)",
    order: 1,
  },
  {
    id: "cat-2",
    slug: "games-entertainment",
    title: "Games & Entertainment",
    description: "Take a break with playful challenges, puzzles, and entertaining interactive experiences.",
    cta: "Play Something Fun",
    examples: ["Memory games", "Trivia challenges", "Pattern puzzles"],
    accentColor: "oklch(0.65 0.18 290)",
    order: 2,
  },
  {
    id: "cat-3",
    slug: "motivation-achievements",
    title: "Motivation & Small Achievements",
    description: "Build momentum with quick wins, daily streaks, and encouraging interactive milestones.",
    cta: "Get a Quick Win",
    examples: ["60-second victories", "Streak celebrations", "Micro-goals"],
    accentColor: "oklch(0.75 0.18 60)",
    order: 3,
  },
  {
    id: "cat-4",
    slug: "focus-concentration",
    title: "Focus & Concentration",
    description: "Enter a quiet state of deep concentration with ambient soundscapes and minimal distractions.",
    cta: "Start Focus Session",
    examples: ["Distraction-free timer", "Soundscapes", "Focus drills"],
    accentColor: "oklch(0.70 0.16 195)",
    order: 4,
  },
  {
    id: "cat-5",
    slug: "refresh-recharge",
    title: "Refresh & Recharge",
    description: "Reset your energy between study sessions with light movement, hydration prompts, and eye rest.",
    cta: "Take a Fresh Break",
    examples: ["Desk stretches", "Hydration pause", "Eye-rest timer"],
    accentColor: "oklch(0.78 0.16 145)",
    order: 5,
  },
  {
    id: "cat-6",
    slug: "creative-expression",
    title: "Creative Expression",
    description: "Express yourself through creativity, imagination, and playful experimentation.",
    cta: "Start Creating",
    examples: ["Digital drawing", "Creative writing prompts", "Color creation"],
    accentColor: "oklch(0.68 0.18 330)",
    order: 6,
  },
  {
    id: "cat-7",
    slug: "emotional-reflection",
    title: "Emotional Reflection",
    description: "Explore your thoughts and feelings through optional, private, self-guided reflection.",
    cta: "Begin Reflection",
    examples: ["Mood journaling", "Gratitude prompts", "Self-reflection"],
    accentColor: "oklch(0.70 0.16 350)",
    order: 7,
  },
  {
    id: "cat-8",
    slug: "interactive-education",
    title: "Interactive Educational Experiences",
    description: "Discover new ideas through playful learning, interactive explanations, and knowledge challenges.",
    cta: "Explore & Learn",
    examples: ["Science simulations", "Interactive quizzes", "Concept explorers"],
    accentColor: "oklch(0.70 0.16 220)",
    order: 8,
  },
];

const SCENARIOS = [
  {
    id: "sc-breathing",
    categorySlug: "relax-reset",
    title: "Guided Breathing",
    description: "Follow a calming breathing pattern with visual guidance. Adjust your own pace and stop whenever you like.",
    durationSeconds: 180,
    durationLabel: "3 min",
    interactionType: "breathing",
    difficulty: "easy",
    hasSound: true,
    published: true,
    component: "BreathingExperience",
  },
  {
    id: "sc-grounding",
    categorySlug: "relax-reset",
    title: "5-4-3-2-1 Grounding",
    description: "A short sensory-awareness activity to help you reconnect with the present moment.",
    durationSeconds: 300,
    durationLabel: "5 min",
    interactionType: "guided",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "GroundingExperience",
  },
  {
    id: "sc-memory",
    categorySlug: "games-entertainment",
    title: "Memory Match",
    description: "Flip cards to find matching pairs. Test and improve your visual memory with increasing difficulty.",
    durationSeconds: 300,
    durationLabel: "5 min",
    interactionType: "game",
    difficulty: "medium",
    hasSound: false,
    published: true,
    component: "MemoryGame",
  },
  {
    id: "sc-trivia",
    categorySlug: "games-entertainment",
    title: "Quick Trivia Challenge",
    description: "Answer fun multiple-choice questions on science, history, and culture. Learn something new each round!",
    durationSeconds: 240,
    durationLabel: "4 min",
    interactionType: "trivia",
    difficulty: "medium",
    hasSound: false,
    published: true,
    component: "TriviaChallenge",
  },
  {
    id: "sc-victory60",
    categorySlug: "motivation-achievements",
    title: "Victory in 60 Seconds",
    description: "Complete a quick, achievable challenge in under a minute. Build momentum with small wins!",
    durationSeconds: 60,
    durationLabel: "1 min",
    interactionType: "challenge",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "MotivationChallenge",
  },
  {
    id: "sc-focus-timer",
    categorySlug: "focus-concentration",
    title: "Focus Timer",
    description: "A distraction-free timer with optional ambient sounds. Set your target duration and stay in the zone.",
    durationSeconds: 1500,
    durationLabel: "25 min",
    interactionType: "timer",
    difficulty: "easy",
    hasSound: true,
    published: true,
    component: "FocusTimer",
  },
  {
    id: "sc-canvas",
    categorySlug: "creative-expression",
    title: "Digital Creative Canvas",
    description: "A freeform drawing canvas with brushes, colors, and sizes. Create whatever inspires you.",
    durationSeconds: 600,
    durationLabel: "10 min",
    interactionType: "canvas",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "CreativeCanvas",
  },
  {
    id: "sc-reflection",
    categorySlug: "emotional-reflection",
    title: "Mood Journal & Reflection",
    description: "Check in with how you feel, write your thoughts, and explore guided reflection prompts. Everything stays private.",
    durationSeconds: 600,
    durationLabel: "10 min",
    interactionType: "journal",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "ReflectionExperience",
  },
  {
    id: "sc-knowledge",
    categorySlug: "interactive-education",
    title: "Knowledge Explorer",
    description: "Test your knowledge with interactive quizzes on science, tech, and nature. Get explanations after every answer.",
    durationSeconds: 300,
    durationLabel: "5 min",
    interactionType: "quiz",
    difficulty: "medium",
    hasSound: false,
    published: true,
    component: "KnowledgeExplorer",
  },
  {
    id: "sc-nature-break",
    categorySlug: "refresh-recharge",
    title: "Nature Pause",
    description: "Step away from your work with a gentle visual break featuring serene natural imagery and calming prompts.",
    durationSeconds: 180,
    durationLabel: "3 min",
    interactionType: "guided",
    difficulty: "easy",
    hasSound: true,
    published: true,
    component: "GroundingExperience",
  },
];

/**
 * GET /api/emotionshift/categories
 */
export async function getCategories(req, res) {
  try {
    return res.json({ categories: CATEGORIES });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch categories", message: err.message });
  }
}

/**
 * GET /api/emotionshift/scenarios
 */
export async function getScenarios(req, res) {
  try {
    const { category } = req.query;
    let list = SCENARIOS.filter((s) => s.published);
    if (category) {
      list = list.filter((s) => s.categorySlug === category);
    }
    return res.json({ scenarios: list });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch scenarios", message: err.message });
  }
}

/**
 * GET /api/emotionshift/scenarios/:id
 */
export async function getScenarioById(req, res) {
  try {
    const scenario = SCENARIOS.find((s) => s.id === req.params.id);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }
    return res.json({ scenario });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch scenario", message: err.message });
  }
}

/**
 * POST /api/emotionshift/sessions
 * Record a completed scenario session
 */
export async function recordSession(req, res) {
  try {
    const { scenarioId, scenarioTitle, categorySlug, completedAt, durationSeconds } = req.body;
    const userId = req.user?.uid || "guest";

    const sessionEntry = {
      id: `es_sess_${uuidv4().slice(0, 8)}`,
      userId,
      scenarioId: scenarioId || "unknown",
      scenarioTitle: scenarioTitle || "Untitled Experience",
      categorySlug: categorySlug || "general",
      durationSeconds: durationSeconds || 180,
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      await db.collection("emotionShiftSessions").doc(sessionEntry.id).set(sessionEntry);
    } else {
      devEmotionShiftSessions.unshift(sessionEntry);
    }

    return res.status(201).json({ success: true, session: sessionEntry });
  } catch (err) {
    return res.status(500).json({ error: "Failed to record session", message: err.message });
  }
}

/**
 * GET /api/emotionshift/sessions
 * Get history of user's EmotionShift sessions
 */
export async function getSessions(req, res) {
  try {
    const userId = req.user?.uid || "guest";

    if (isFirebaseConfigured && db) {
      const snap = await db
        .collection("emotionShiftSessions")
        .where("userId", "==", userId)
        .orderBy("completedAt", "desc")
        .limit(50)
        .get();

      const sessions = snap.docs.map((d) => d.data());
      return res.json({ sessions });
    } else {
      const sessions = devEmotionShiftSessions.filter((s) => s.userId === userId || userId === "guest");
      return res.json({ sessions: sessions.slice(0, 50) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve sessions", message: err.message });
  }
}

/**
 * POST /api/emotionshift/recommendations
 * Given a mood or detected emotion, recommend top scenarios
 */
export async function getRecommendations(req, res) {
  try {
    const { mood, detectedEmotion } = req.body;
    let targetCategorySlugs = [];

    if (mood) {
      const moodMap = {
        relax: ["relax-reset", "refresh-recharge"],
        fun: ["games-entertainment"],
        motivation: ["motivation-achievements"],
        focus: ["focus-concentration"],
        break: ["refresh-recharge", "relax-reset"],
        creative: ["creative-expression"],
        reflect: ["emotional-reflection"],
        learn: ["interactive-education"],
      };
      targetCategorySlugs = moodMap[mood] || [];
    } else if (detectedEmotion) {
      // Mapping detected emotions to optimal shift activities
      const emotionMap = {
        stressed: ["relax-reset", "refresh-recharge"],
        anxious: ["relax-reset", "emotional-reflection"],
        frustrated: ["games-entertainment", "relax-reset"],
        bored: ["games-entertainment", "motivation-achievements"],
        fatigued: ["refresh-recharge", "motivation-achievements"],
        neutral: ["focus-concentration", "interactive-education"],
        happy: ["creative-expression", "interactive-education"],
      };
      targetCategorySlugs = emotionMap[detectedEmotion.toLowerCase()] || ["relax-reset"];
    }

    let recommendations = [];
    if (targetCategorySlugs.length > 0) {
      recommendations = SCENARIOS.filter(
        (s) => s.published && targetCategorySlugs.includes(s.categorySlug)
      );
    } else {
      recommendations = SCENARIOS.slice(0, 4);
    }

    return res.json({ recommendations });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate recommendations", message: err.message });
  }
}
