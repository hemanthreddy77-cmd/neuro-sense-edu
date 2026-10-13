import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";
import { MoodCheckIn } from "./MoodCheckIn";

export function EmotionShiftHero({
  searchQuery,
  onSearchChange,
  onOpenMoodCheckIn,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMoodCheckIn?: () => void;
}) {
  const [internalMoodOpen, setInternalMoodOpen] = useState(false);
  const handleMoodClick = onOpenMoodCheckIn || (() => setInternalMoodOpen(true));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
          <Sparkles className="h-3 w-3" />
          EmotionShift AI &bull; Personalized Experiences
        </span>
      </div>

      {/* Heading */}
      <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
        Find Your Next <span className="text-gradient">Experience</span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        Explore interactive experiences designed around how you want to feel, learn, create, and
        recharge.
      </p>

      {/* Actions row */}
      <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search experiences…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition"
          />
        </div>

        {/* Mood check-in */}
        <GradientButton
          variant="outline"
          className="shrink-0 whitespace-nowrap"
          onClick={handleMoodClick}
        >
          <Sparkles className="h-4 w-4" />
          How are you feeling?
        </GradientButton>
      </div>

      {/* Supporting text */}
      <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground/70">
        Take a moment for yourself. Explore something creative, discover a new challenge, or choose
        an experience that suits what you need right now.
      </p>

      {/* Mood check-in modal if managed internally */}
      {!onOpenMoodCheckIn && (
        <MoodCheckIn open={internalMoodOpen} onClose={() => setInternalMoodOpen(false)} />
      )}
    </section>
  );
}
