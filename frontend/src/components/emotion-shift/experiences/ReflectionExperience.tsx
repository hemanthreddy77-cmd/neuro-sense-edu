import { useState } from "react";
import { Heart, Lock, CheckCircle2, RotateCcw } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface ReflectionProps {
  onComplete?: () => void;
}

const FEELING_TAGS = [
  "Peaceful",
  "Grateful",
  "Overwhelmed",
  "Inspired",
  "Tired",
  "Hopeful",
  "Restless",
  "Thoughtful",
  "Curious",
  "Proud",
];

const PROMPTS = [
  "What is one small victory or moment of beauty you experienced today?",
  "What is a thought or worry you can consciously give yourself permission to set down?",
  "Who is someone you appreciate right now, and why?",
  "What does your mind or body need most in this current chapter?",
];

export function ReflectionExperience({ onComplete }: ReflectionProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = () => {
    if (!reflectionText.trim()) return;
    try {
      const history = JSON.parse(localStorage.getItem("neuro_reflections") || "[]");
      history.push({
        id: Date.now(),
        date: new Date().toISOString(),
        tags: selectedTags,
        prompt: PROMPTS[selectedPromptIdx],
        content: reflectionText,
      });
      localStorage.setItem("neuro_reflections", JSON.stringify(history));
    } catch {
      // LocalStorage error fallback
    }
    setIsSaved(true);
    onComplete?.();
  };

  const handleReset = () => {
    setSelectedTags([]);
    setReflectionText("");
    setIsSaved(false);
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto min-h-105 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <Heart className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Reflection Recorded</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
          Taking time to articulate your inner state is a proven practice for emotional clarity and
          cognitive resilience.
        </p>

        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground max-w-sm">
          🔒 Your thoughts are saved strictly on your local device. No one else has access to them.
        </div>

        <GradientButton onClick={handleReset} className="mt-6">
          <RotateCcw className="h-4 w-4 mr-2" /> Write Another Reflection
        </GradientButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full max-w-lg mx-auto min-h-120 py-4">
      <div>
        {/* Privacy Note */}
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5" /> Emotional Reflection
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
            <Lock className="h-3 w-3" /> 100% Private & Local
          </span>
        </div>

        {/* Feelings selector */}
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          How would you describe your headspace right now?
        </label>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {FEELING_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-xs transition-all ${
                  isSelected
                    ? "bg-rose-500 text-white font-medium shadow-md shadow-rose-500/20"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Guided prompt selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Reflection Prompt
            </label>
            <button
              onClick={() => setSelectedPromptIdx((p) => (p + 1) % PROMPTS.length)}
              className="text-[11px] text-brand hover:underline"
            >
              Shuffle prompt
            </button>
          </div>
          <p className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground font-medium italic">
            "{PROMPTS[selectedPromptIdx]}"
          </p>
        </div>

        {/* Text Area */}
        <div className="relative mt-3">
          <textarea
            rows={5}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write openly here... there is no right or wrong way to feel."
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-400/50 resize-none leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">
            {reflectionText.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Express whatever comes up.</span>
        <GradientButton onClick={handleSave} disabled={!reflectionText.trim()} className="gap-2">
          <CheckCircle2 className="h-4 w-4" /> Save & Close
        </GradientButton>
      </div>
    </div>
  );
}
