import { useState } from "react";
import { Lightbulb, Brain, Sparkles, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface KnowledgeExplorerProps {
  onComplete?: () => void;
}

const TOPICS = [
  {
    id: "neuroplasticity",
    title: "Neuroplasticity in Action",
    category: "Brain Science",
    icon: Brain,
    summary:
      "Your brain physically rewires itself every time you encounter friction and push through confusion. Frustration is not a sign of inability—it is the biological sensation of synaptogenesis.",
    practicalTip:
      "When a concept feels challenging, say: 'My neurons are currently forging a new pathway.' This reframes physiological stress into developmental growth.",
    question: "What physical event happens in your brain when learning something difficult?",
    options: [
      "Neurons shrink to save energy",
      "Synaptic connections strengthen and new neural paths form",
      "Brain tissue hardens permanently",
    ],
    correctIdx: 1,
  },
  {
    id: "circadian",
    title: "Ultradian Focus Cycles",
    category: "Peak Performance",
    icon: Lightbulb,
    summary:
      "Human attention operates on 90-minute ultradian rhythms. Attempting continuous high-intensity focus without breaks leads to exponential cognitive fatigue and reduced retention.",
    practicalTip:
      "Work in 45-to-90 minute dedicated blocks, followed immediately by 10 to 15 minutes of low-stimulation recovery (looking at the horizon, taking a brief walk).",
    question: "What is the optimal natural rhythm for human sustained mental focus?",
    options: ["8 uninterrupted hours", "Around 90 minutes", "10 seconds max"],
    correctIdx: 1,
  },
  {
    id: "habits",
    title: "The Neurochemistry of Habit Loops",
    category: "Behavioral Design",
    icon: Sparkles,
    summary:
      "Habits run on a three-part neurological loop: Cue -> Routine -> Reward. The brain's basal ganglia automate these sequences to conserve valuable prefrontal cortex fuel.",
    practicalTip:
      "To build a learning habit, tether it to an existing automatic cue: 'After I pour my morning tea, I will read one lesson for 5 minutes.'",
    question: "Which brain region automates repetitive habit routines?",
    options: ["Basal Ganglia", "Spinal Cord", "Olfactory Bulb"],
    correctIdx: 0,
  },
];

export function KnowledgeExplorer({ onComplete }: KnowledgeExplorerProps) {
  const [topicIdx, setTopicIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isAllDone, setIsAllDone] = useState(false);

  const topic = TOPICS[topicIdx];
  const Icon = topic.icon;

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (!completedTopics.includes(topic.id)) {
      setCompletedTopics([...completedTopics, topic.id]);
    }
  };

  const handleNext = () => {
    if (topicIdx < TOPICS.length - 1) {
      setTopicIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsAllDone(true);
      onComplete?.();
    }
  };

  const handleRestart = () => {
    setTopicIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCompletedTopics([]);
    setIsAllDone(false);
  };

  if (isAllDone) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto min-h-105 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Explorer Modules Completed!</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
          You expanded your mental models around neuroplasticity, ultradian focus, and habit loops.
          Apply one insight into your learning today!
        </p>
        <GradientButton onClick={handleRestart} className="mt-6">
          <RotateCcw className="h-4 w-4 mr-2" /> Review Topics
        </GradientButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full max-w-xl mx-auto min-h-120 py-4">
      <div>
        {/* Header navigation pills */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider">
              {topic.category}
            </span>
            <span>•</span>
            <span>
              Topic {topicIdx + 1} of {TOPICS.length}
            </span>
          </div>

          <div className="flex gap-1.5">
            {TOPICS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setTopicIdx(idx);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === topicIdx ? "w-6 bg-cyan-400" : "w-2 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Topic Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{topic.title}</h3>
        </div>

        {/* Insight Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground leading-relaxed mb-4">
          <p className="text-foreground text-sm font-normal mb-3">{topic.summary}</p>
          <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3 text-cyan-300">
            <span className="font-semibold text-cyan-200">💡 Practical Action:</span>{" "}
            {topic.practicalTip}
          </div>
        </div>

        {/* Quick Check Question */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
            Quick Check: {topic.question}
          </span>
          <div className="grid gap-2">
            {topic.options.map((opt, optIdx) => {
              let optStyle = "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground";
              if (showExplanation) {
                if (optIdx === topic.correctIdx) {
                  optStyle = "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-medium";
                } else if (optIdx === selectedAnswer) {
                  optStyle = "border-rose-500/40 bg-rose-500/15 text-rose-300";
                } else {
                  optStyle = "opacity-40 border-white/5";
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleAnswer(optIdx)}
                  disabled={showExplanation}
                  className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all ${optStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
        <span className="text-xs text-muted-foreground">
          {showExplanation ? "Great insight!" : "Select an answer to proceed."}
        </span>
        <GradientButton onClick={handleNext} disabled={!showExplanation} className="gap-2">
          {topicIdx === TOPICS.length - 1 ? "Finish Module" : "Next Topic"}
          <ChevronRight className="h-4 w-4" />
        </GradientButton>
      </div>
    </div>
  );
}
