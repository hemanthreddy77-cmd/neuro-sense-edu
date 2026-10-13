import { Link } from "@tanstack/react-router";
import { Clock, Volume2, Sparkles, ArrowRight } from "lucide-react";
import type { Scenario } from "@/data/emotionShiftData";
import { SCENARIO_CATEGORIES } from "@/data/emotionShiftData";
import { cn } from "@/lib/utils";

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const category = SCENARIO_CATEGORIES.find((c) => c.slug === scenario.categorySlug);
  const CategoryIcon = category?.icon || Sparkles;

  const difficultyColors = {
    easy: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    medium: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    hard: "text-rose-400 border-rose-500/20 bg-rose-500/10",
  }[scenario.difficulty];

  return (
    <Link
      to="/emotion-shift/play/$scenarioId"
      params={{ scenarioId: scenario.id }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
    >
      {/* Category accent line on top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 group-hover:h-1.5"
        style={{
          background: category?.accentColor || "var(--color-brand)",
        }}
      />

      <div>
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {category && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: `color-mix(in oklab, ${category.accentColor} 18%, transparent)`,
                color: category.accentColor,
              }}
            >
              <CategoryIcon className="h-3 w-3" />
              {category.title}
            </span>
          )}

          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
              difficultyColors,
            )}
          >
            {scenario.difficulty}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {scenario.durationLabel}
          </span>

          {scenario.hasSound && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-400"
              title="Includes soothing audio tones"
            >
              <Volume2 className="h-3 w-3" />
              Audio
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-brand transition-colors">
          {scenario.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {scenario.description}
        </p>
      </div>

      {/* Bottom action */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
          {scenario.interactionType}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5"
          style={{ color: category?.accentColor || "var(--color-brand)" }}
        >
          Start Experience
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
