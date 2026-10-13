import { EMOTIONS, type EmotionKey } from "@/data/mockData";
import { Info } from "lucide-react";

const COPY: Record<EmotionKey, { title: string; body: string; intent: "good" | "warn" | "bad" }> = {
  happy: {
    title: "Great vibe! Continuing at this pace…",
    body: "You're enjoying this — keeping the current flow.",
    intent: "good",
  },
  focused: {
    title: "Great focus! Continuing…",
    body: "Deep work detected. Maintaining current depth.",
    intent: "good",
  },
  curious: {
    title: "You're exploring — surfacing related ideas",
    body: "Adding side notes and bonus context.",
    intent: "good",
  },
  motivated: {
    title: "High motivation — leveling up content",
    body: "Increasing challenge to match your energy.",
    intent: "good",
  },
  confused: {
    title: "Showing simpler explanation…",
    body: "Switching to a step-by-step walkthrough.",
    intent: "warn",
  },
  bored: {
    title: "Switching to interactive content…",
    body: "Loading a quick exercise to re-engage you.",
    intent: "warn",
  },
  angry: {
    title: "Taking a short break recommended",
    body: "Try a 2-minute pause before continuing.",
    intent: "bad",
  },
};

export function AdaptiveBanner({ emotion }: { emotion: EmotionKey }) {
  const e = EMOTIONS[emotion];
  const copy = COPY[emotion];
  const tint = copy.intent === "good" ? e.hex : copy.intent === "warn" ? "#F2C94C" : "#EB5757";

  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 animate-fade-in-up"
      style={{
        backgroundColor: `color-mix(in oklab, ${tint} 12%, transparent)`,
        borderColor: `color-mix(in oklab, ${tint} 40%, transparent)`,
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{ backgroundColor: `color-mix(in oklab, ${tint} 22%, transparent)` }}
      >
        <span aria-hidden>{e.emoji}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="h-3.5 w-3.5 opacity-70" />
          {copy.title}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{copy.body}</div>
      </div>
    </div>
  );
}
