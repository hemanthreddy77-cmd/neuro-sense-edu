import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ScenarioCategory } from "@/data/emotionShiftData";

export function ScenarioCategoryCard({ category }: { category: ScenarioCategory }) {
  const Icon = category.icon;

  return (
    <Link
      to="/emotion-shift/scenarios"
      search={{ category: category.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`${category.title} — ${category.description}`}
    >
      {/* Background gradient layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100",
          category.gradient,
        )}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: category.accentColor }}
      />

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
        {/* Icon */}
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: category.glowColor,
          }}
        >
          <Icon
            className="h-5 w-5 transition-colors duration-300"
            style={{ color: category.accentColor }}
          />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-base font-semibold text-foreground leading-snug">
          {category.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {category.description}
        </p>

        {/* Example labels */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {category.examples.map((ex) => (
            <span
              key={ex}
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {ex}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
            style={{
              backgroundColor: category.glowColor,
              color: category.accentColor,
            }}
          >
            {category.cta}
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
