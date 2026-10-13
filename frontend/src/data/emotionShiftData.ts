import type { LucideIcon } from "lucide-react";
import { Wind, Gamepad2, Trophy, Target, Coffee, Palette, Heart, Lightbulb } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

export type ScenarioCategorySlug =
  | "relax-reset"
  | "games-entertainment"
  | "motivation-achievements"
  | "focus-concentration"
  | "refresh-recharge"
  | "creative-expression"
  | "emotional-reflection"
  | "interactive-education";

export type ScenarioCategory = {
  id: string;
  slug: ScenarioCategorySlug;
  title: string;
  description: string;
  icon: LucideIcon;
  cta: string;
  examples: string[];
  gradient: string;
  accentColor: string;
  glowColor: string;
  order: number;
};

export type ScenarioDifficulty = "easy" | "medium" | "hard";
export type InteractionType =
  | "breathing"
  | "guided"
  | "game"
  | "trivia"
  | "challenge"
  | "timer"
  | "canvas"
  | "quiz"
  | "journal"
  | "exploration";

export type Scenario = {
  id: string;
  categorySlug: ScenarioCategorySlug;
  title: string;
  description: string;
  durationSeconds: number;
  durationLabel: string;
  interactionType: InteractionType;
  difficulty: ScenarioDifficulty;
  hasSound: boolean;
  published: boolean;
  component: string; // maps to the React component name
};

export type MoodOption = {
  id: string;
  label: string;
  emoji: string;
  categorySlugs: ScenarioCategorySlug[];
};

// ─── Categories ──────────────────────────────────────────────────

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    id: "cat-1",
    slug: "relax-reset",
    title: "Relax & Reset",
    description: "Slow down, take a breath, and explore calming experiences at your own pace.",
    icon: Wind,
    cta: "Explore Calm Experiences",
    examples: ["Guided breathing", "Grounding exercises", "Peaceful scenes"],
    gradient: "from-blue-500/20 via-indigo-500/10 to-purple-500/20",
    accentColor: "oklch(0.72 0.12 260)",
    glowColor: "oklch(0.72 0.12 260 / 25%)",
    order: 1,
  },
  {
    id: "cat-2",
    slug: "games-entertainment",
    title: "Games & Entertainment",
    description:
      "Take a break with playful challenges, puzzles, and entertaining interactive experiences.",
    icon: Gamepad2,
    cta: "Play Something Fun",
    examples: ["Memory games", "Trivia challenges", "Pattern puzzles"],
    gradient: "from-purple-500/20 via-blue-500/10 to-cyan-500/20",
    accentColor: "oklch(0.65 0.18 290)",
    glowColor: "oklch(0.65 0.18 290 / 25%)",
    order: 2,
  },
  {
    id: "cat-3",
    slug: "motivation-achievements",
    title: "Motivation & Small Achievements",
    description:
      "Build momentum through small challenges, achievable goals, and rewarding experiences.",
    icon: Trophy,
    cta: "Start a Challenge",
    examples: ["60-second challenges", "Mini-goal completion", "Achievement tracker"],
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    accentColor: "oklch(0.78 0.15 80)",
    glowColor: "oklch(0.78 0.15 80 / 25%)",
    order: 3,
  },
  {
    id: "cat-4",
    slug: "focus-concentration",
    title: "Focus & Concentration",
    description:
      "Explore activities that encourage attention, concentration, and focused engagement.",
    icon: Target,
    cta: "Enter Focus Mode",
    examples: ["Focus timers", "Attention puzzles", "Pattern recognition"],
    gradient: "from-indigo-500/20 via-blue-500/10 to-sky-500/20",
    accentColor: "oklch(0.62 0.18 255)",
    glowColor: "oklch(0.62 0.18 255 / 25%)",
    order: 4,
  },
  {
    id: "cat-5",
    slug: "refresh-recharge",
    title: "Refresh & Recharge",
    description:
      "Take a refreshing pause with gentle activities before returning to your next task.",
    icon: Coffee,
    cta: "Take a Refreshing Break",
    examples: ["Short visual breaks", "Nature exploration", "Quiet-screen time"],
    gradient: "from-teal-500/20 via-emerald-500/10 to-cyan-500/20",
    accentColor: "oklch(0.72 0.14 180)",
    glowColor: "oklch(0.72 0.14 180 / 25%)",
    order: 5,
  },
  {
    id: "cat-6",
    slug: "creative-expression",
    title: "Creative Expression",
    description: "Express yourself through creativity, imagination, and playful experimentation.",
    icon: Palette,
    cta: "Start Creating",
    examples: ["Digital drawing", "Creative writing prompts", "Color creation"],
    gradient: "from-pink-500/20 via-purple-500/10 to-rose-500/20",
    accentColor: "oklch(0.68 0.18 330)",
    glowColor: "oklch(0.68 0.18 330 / 25%)",
    order: 6,
  },
  {
    id: "cat-7",
    slug: "emotional-reflection",
    title: "Emotional Reflection",
    description:
      "Explore your thoughts and feelings through optional, private, self-guided reflection.",
    icon: Heart,
    cta: "Begin Reflection",
    examples: ["Mood journaling", "Gratitude prompts", "Self-reflection"],
    gradient: "from-rose-500/20 via-pink-500/10 to-purple-500/20",
    accentColor: "oklch(0.70 0.16 350)",
    glowColor: "oklch(0.70 0.16 350 / 25%)",
    order: 7,
  },
  {
    id: "cat-8",
    slug: "interactive-education",
    title: "Interactive Educational Experiences",
    description:
      "Discover new ideas through playful learning, interactive explanations, and knowledge challenges.",
    icon: Lightbulb,
    cta: "Explore & Learn",
    examples: ["Science simulations", "Interactive quizzes", "Concept explorers"],
    gradient: "from-cyan-500/20 via-blue-500/10 to-indigo-500/20",
    accentColor: "oklch(0.70 0.16 220)",
    glowColor: "oklch(0.70 0.16 220 / 25%)",
    order: 8,
  },
];

// ─── Scenarios ───────────────────────────────────────────────────

export const SCENARIOS: Scenario[] = [
  // Relax & Reset
  {
    id: "sc-breathing",
    categorySlug: "relax-reset",
    title: "Guided Breathing",
    description:
      "Follow a calming breathing pattern with visual guidance. Adjust your own pace and stop whenever you like.",
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
    description:
      "A short sensory-awareness activity to help you reconnect with the present moment.",
    durationSeconds: 300,
    durationLabel: "5 min",
    interactionType: "guided",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "GroundingExperience",
  },
  // Games & Entertainment
  {
    id: "sc-memory",
    categorySlug: "games-entertainment",
    title: "Memory Match",
    description:
      "Flip cards to find matching pairs. Test and improve your visual memory with increasing difficulty.",
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
    description:
      "Answer fun multiple-choice questions on science, history, and culture. Learn something new each round!",
    durationSeconds: 240,
    durationLabel: "4 min",
    interactionType: "trivia",
    difficulty: "medium",
    hasSound: false,
    published: true,
    component: "TriviaChallenge",
  },
  // Motivation & Small Achievements
  {
    id: "sc-victory60",
    categorySlug: "motivation-achievements",
    title: "Victory in 60 Seconds",
    description:
      "Complete a quick, achievable challenge in under a minute. Build momentum with small wins!",
    durationSeconds: 60,
    durationLabel: "1 min",
    interactionType: "challenge",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "MotivationChallenge",
  },
  // Focus & Concentration
  {
    id: "sc-focus-timer",
    categorySlug: "focus-concentration",
    title: "Focus Timer",
    description:
      "A distraction-free timer with optional ambient sounds. Set your target duration and stay in the zone.",
    durationSeconds: 1500,
    durationLabel: "25 min",
    interactionType: "timer",
    difficulty: "easy",
    hasSound: true,
    published: true,
    component: "FocusTimer",
  },
  // Creative Expression
  {
    id: "sc-canvas",
    categorySlug: "creative-expression",
    title: "Digital Creative Canvas",
    description:
      "A freeform drawing canvas with brushes, colors, and sizes. Create whatever inspires you.",
    durationSeconds: 600,
    durationLabel: "10 min",
    interactionType: "canvas",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "CreativeCanvas",
  },
  // Emotional Reflection
  {
    id: "sc-reflection",
    categorySlug: "emotional-reflection",
    title: "Mood Journal & Reflection",
    description:
      "Check in with how you feel, write your thoughts, and explore guided reflection prompts. Everything stays private.",
    durationSeconds: 600,
    durationLabel: "10 min",
    interactionType: "journal",
    difficulty: "easy",
    hasSound: false,
    published: true,
    component: "ReflectionExperience",
  },
  // Interactive Educational
  {
    id: "sc-knowledge",
    categorySlug: "interactive-education",
    title: "Knowledge Explorer",
    description:
      "Test your knowledge with interactive quizzes on science, tech, and nature. Get explanations after every answer.",
    durationSeconds: 300,
    durationLabel: "5 min",
    interactionType: "quiz",
    difficulty: "medium",
    hasSound: false,
    published: true,
    component: "KnowledgeExplorer",
  },
  // Refresh & Recharge (bonus)
  {
    id: "sc-nature-break",
    categorySlug: "refresh-recharge",
    title: "Nature Pause",
    description:
      "Step away from your work with a gentle visual break featuring serene natural imagery and calming prompts.",
    durationSeconds: 180,
    durationLabel: "3 min",
    interactionType: "guided",
    difficulty: "easy",
    hasSound: true,
    published: true,
    component: "GroundingExperience", // reuses grounding with nature theme
  },
];

// ─── Mood Check-In Options ───────────────────────────────────────

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "mood-relax",
    label: "I want to relax",
    emoji: "🧘",
    categorySlugs: ["relax-reset", "refresh-recharge"],
  },
  {
    id: "mood-fun",
    label: "I want something fun",
    emoji: "🎮",
    categorySlugs: ["games-entertainment"],
  },
  {
    id: "mood-motivation",
    label: "I want motivation",
    emoji: "🏆",
    categorySlugs: ["motivation-achievements"],
  },
  {
    id: "mood-focus",
    label: "I want to focus",
    emoji: "🎯",
    categorySlugs: ["focus-concentration"],
  },
  {
    id: "mood-break",
    label: "I need a refreshing break",
    emoji: "☕",
    categorySlugs: ["refresh-recharge", "relax-reset"],
  },
  {
    id: "mood-creative",
    label: "I want to be creative",
    emoji: "🎨",
    categorySlugs: ["creative-expression"],
  },
  {
    id: "mood-reflect",
    label: "I want to reflect",
    emoji: "💜",
    categorySlugs: ["emotional-reflection"],
  },
  {
    id: "mood-learn",
    label: "I want to learn something",
    emoji: "💡",
    categorySlugs: ["interactive-education"],
  },
  {
    id: "mood-unsure",
    label: "I'm not sure",
    emoji: "🤷",
    categorySlugs: [],
  },
  {
    id: "mood-all",
    label: "Show me everything",
    emoji: "✨",
    categorySlugs: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

export function getCategoryBySlug(slug: ScenarioCategorySlug): ScenarioCategory | undefined {
  return SCENARIO_CATEGORIES.find((c) => c.slug === slug);
}

export function getScenariosForCategory(slug: ScenarioCategorySlug): Scenario[] {
  return SCENARIOS.filter((s) => s.categorySlug === slug && s.published);
}

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getRecommendedScenarios(
  categorySlugs: ScenarioCategorySlug[],
  limit = 4,
): Scenario[] {
  if (categorySlugs.length === 0) {
    // Show everything — pick one from each category
    const seen = new Set<ScenarioCategorySlug>();
    const picks: Scenario[] = [];
    for (const s of SCENARIOS) {
      if (s.published && !seen.has(s.categorySlug)) {
        picks.push(s);
        seen.add(s.categorySlug);
        if (picks.length >= limit) break;
      }
    }
    return picks;
  }
  return SCENARIOS.filter((s) => s.published && categorySlugs.includes(s.categorySlug)).slice(
    0,
    limit,
  );
}
