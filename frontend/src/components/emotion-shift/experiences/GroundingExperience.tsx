import { useState } from "react";
import {
  Eye,
  Hand,
  Ear,
  Wind,
  Sparkles,
  Check,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface GroundingProps {
  onComplete?: () => void;
}

const STEPS = [
  {
    count: 5,
    title: "5 Things You Can SEE",
    icon: Eye,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    instruction:
      "Look around your space right now. Notice 5 distinct items you wouldn't normally pay attention to.",
    prompts: [
      "A pattern of shadows or light",
      "A small detail on an object near you",
      "A color you haven't noticed today",
      "Something on the wall or ceiling",
      "A texture in the room",
    ],
  },
  {
    count: 4,
    title: "4 Things You Can FEEL",
    icon: Hand,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    instruction: "Bring attention to physical sensations and textures touching your body.",
    prompts: [
      "The weight of your feet firmly on the floor",
      "The texture of the clothes against your skin",
      "The temperature of the room on your hands or face",
      "The surface beneath your fingertips",
    ],
  },
  {
    count: 3,
    title: "3 Things You Can HEAR",
    icon: Ear,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    instruction: "Close your eyes or look down. Listen for three subtle sounds around you.",
    prompts: [
      "A distant ambient sound (wind, cars, hum)",
      "A sound nearby in your room",
      "The rhythm of your own breathing",
    ],
  },
  {
    count: 2,
    title: "2 Things You Can SMELL",
    icon: Wind,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    instruction: "Take a gentle breath in through your nose. What aromas or scents are present?",
    prompts: [
      "A scent in the air around you or on your wrist",
      "The fresh air or a favorite calming memory of a scent",
    ],
  },
  {
    count: 1,
    title: "1 Thing You Can TASTE or Cherish",
    icon: Sparkles,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    instruction:
      "Notice any lingering taste in your mouth, or take a sip of water. Internalize a feeling of peace.",
    prompts: ["A taste, sip of water, or a quiet moment of gratitude for your resilience"],
  },
];

export function GroundingExperience({ onComplete }: GroundingProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const step = STEPS[currentStepIdx];
  const StepIcon = step.icon;

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setCheckedItems({});
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto min-h-100">
        <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">You Are Grounded & Present</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          You just anchored your sensory awareness into the present moment. Notice the sense of
          clarity and stability you created.
        </p>
        <div className="mt-8 flex gap-3">
          <GradientButton onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Repeat Exercise
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-between min-h-120 py-4">
      {/* Progress header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {currentStepIdx + 1} of {STEPS.length}
          </span>
          <div className="flex gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  idx === currentStepIdx
                    ? "bg-brand w-10"
                    : idx < currentStepIdx
                      ? "bg-emerald-500"
                      : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Title & Icon */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2.5 rounded-xl border ${step.color}`}>
            <StepIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
            <p className="text-xs text-muted-foreground">{step.instruction}</p>
          </div>
        </div>
      </div>

      {/* Prompts checklist */}
      <div className="space-y-3 my-6">
        {step.prompts.map((prompt, pIdx) => {
          const itemKey = `${currentStepIdx}-${pIdx}`;
          const isChecked = !!checkedItems[itemKey];

          return (
            <button
              key={pIdx}
              onClick={() => toggleItem(itemKey)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                isChecked
                  ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "border-emerald-400 bg-emerald-500 text-white"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5 stroke-3" />}
                </div>
                <span className={`text-sm ${isChecked ? "font-medium text-foreground" : ""}`}>
                  {prompt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
        <button
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Start Over
        </button>

        <GradientButton onClick={handleNext} className="gap-2">
          {currentStepIdx === STEPS.length - 1 ? "Finish Grounding" : "Next Sense"}
          <ChevronRight className="h-4 w-4" />
        </GradientButton>
      </div>
    </div>
  );
}
