import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface TriviaChallengeProps {
  onComplete?: () => void;
}

type Question = {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  category: string;
};

const QUESTIONS: Question[] = [
  {
    category: "Neuroscience",
    question:
      "Which part of the human brain is considered the primary processing center for emotions like fear and joy?",
    options: ["Hippocampus", "Amygdala", "Cerebellum", "Occipital Lobe"],
    correctIdx: 1,
    explanation:
      "The amygdala plays a central role in processing emotional memories and reactions, especially fear, novelty, and emotional arousal.",
  },
  {
    category: "Space Science",
    question: "Approximately how long does sunlight take to reach Earth?",
    options: ["8 minutes and 20 seconds", "1 second", "45 minutes", "24 hours"],
    correctIdx: 0,
    explanation:
      "Light travels through the vacuum of space at ~300,000 km/s, covering the 150 million km from the Sun to Earth in ~8m 20s.",
  },
  {
    category: "Psychology",
    question:
      "What term describes the mental state of deep immersion, focus, and energized enjoyment in an activity?",
    options: ["Hyper-arousal", "Flow State", "Cognitive Drift", "Euphoria Loop"],
    correctIdx: 1,
    explanation:
      "Coined by psychologist Mihaly Csikszentmihalyi, 'Flow' is being completely absorbed in what one does, losing track of time.",
  },
  {
    category: "Biology",
    question:
      "Which neurotransmitter is most commonly associated with reward expectation, learning, and motivation?",
    options: ["Dopamine", "Melatonin", "Cortisol", "Histamine"],
    correctIdx: 0,
    explanation:
      "Dopamine reinforces anticipation of rewards, motivating goal-directed action and reinforcing positive learning habits.",
  },
  {
    category: "Nature",
    question:
      "What forest phenomenon involves trees releasing organic compounds (phytoncides) that lower human stress hormones?",
    options: [
      "Canopy shade effect",
      "Shinrin-yoku (Forest Bathing)",
      "Chlorophyll saturation",
      "Floral resonance",
    ],
    correctIdx: 1,
    explanation:
      "Japanese researchers demonstrated that spending mindful time under forest canopies boosts natural killer cells and cuts stress cortisol.",
  },
];

export function TriviaChallenge({ onComplete }: TriviaChallengeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const q = QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === q.correctIdx) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete?.();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto min-h-105">
        <div className="h-16 w-16 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center mb-4 text-brand">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Challenge Finished!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You scored <span className="font-bold text-foreground text-base">{score}</span> out of{" "}
          <span className="font-bold text-foreground text-base">{QUESTIONS.length}</span>!
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground max-w-sm">
          {score >= 4
            ? "Outstanding curiosity and recall! Your mind is quick and receptive."
            : "Great effort! A quick round of curiosity is wonderful for cognitive stimulation."}
        </div>

        <GradientButton onClick={handleRestart} className="mt-6">
          <RotateCcw className="h-4 w-4 mr-2" /> Play Again
        </GradientButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full max-w-xl mx-auto min-h-115 py-4">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="font-semibold text-brand tracking-wider uppercase">{q.category}</span>
          <span>
            Question {currentIdx + 1} of {QUESTIONS.length} • Score: {score}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question text */}
        <h3 className="text-lg font-semibold text-foreground leading-snug mb-6">{q.question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5 my-2">
        {q.options.map((opt, idx) => {
          let btnClass =
            "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-foreground";
          if (isAnswered) {
            if (idx === q.correctIdx) {
              btnClass = "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 font-medium";
            } else if (idx === selectedIdx) {
              btnClass = "border-rose-500/50 bg-rose-500/20 text-rose-300";
            } else {
              btnClass = "border-white/5 bg-transparent text-muted-foreground opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm text-left transition-all ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === q.correctIdx && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              )}
              {isAnswered && idx === selectedIdx && idx !== q.correctIdx && (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation on answer */}
      {isAnswered && (
        <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground leading-relaxed animate-fade-in">
          <span className="font-semibold text-foreground mr-1">Explanation:</span>
          {q.explanation}
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-end pt-4 mt-auto border-t border-white/10">
        <GradientButton onClick={handleNext} disabled={!isAnswered} className="gap-2">
          {currentIdx === QUESTIONS.length - 1 ? "Complete Challenge" : "Next Question"}
          <ArrowRight className="h-4 w-4" />
        </GradientButton>
      </div>
    </div>
  );
}
