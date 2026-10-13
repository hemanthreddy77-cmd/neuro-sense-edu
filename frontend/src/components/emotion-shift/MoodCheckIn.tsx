import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { MOOD_OPTIONS } from "@/data/emotionShiftData";

export function MoodCheckIn({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleSelect = (moodId: string) => {
    const mood = MOOD_OPTIONS.find((m) => m.id === moodId);
    if (!mood) return;

    // If the user has specific category preferences, go to listing filtered
    if (mood.categorySlugs.length > 0) {
      navigate({
        to: "/emotion-shift/scenarios",
        search: { category: mood.categorySlugs[0] },
      });
    } else {
      // "I'm not sure" or "Show me everything" — stay on main page, scroll to categories
      onClose();
      const el = document.getElementById("categories");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className="glass-strong relative w-full max-w-md rounded-2xl p-6 animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-label="Mood check-in"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold text-foreground">How are you feeling?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick what resonates right now. We'll suggest experiences that match.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
            >
              <span className="text-lg">{mood.emoji}</span>
              {mood.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          This is not a medical assessment. You're always in control of what you explore.
        </p>
      </div>
    </div>
  );
}
