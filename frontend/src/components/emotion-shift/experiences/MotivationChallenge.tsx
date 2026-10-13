import { useState, useEffect } from "react";
import { Flame, Play, CheckCircle2, RotateCcw, Zap } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface MotivationChallengeProps {
  onComplete?: () => void;
}

const QUICK_ACTIONS = [
  "Clear 3 items off your desk right now",
  "Drink a full glass of fresh water",
  "Stand up, roll your shoulders, and stretch upwards",
  "Write down the single most important task for today",
  "Close 5 unnecessary browser tabs",
  "Take 3 deep breaths and set an intention for the next hour",
];

export function MotivationChallenge({ onComplete }: MotivationChallengeProps) {
  const [selectedAction, setSelectedAction] = useState(QUICK_ACTIONS[0]);
  const [customAction, setCustomAction] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      onComplete?.();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handleIWonEarly = () => {
    setIsRunning(false);
    setIsCompleted(true);
    onComplete?.();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(60);
    setIsCompleted(false);
  };

  const currentTask = customAction.trim() || selectedAction;

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto min-h-105 animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-linear-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white mb-4 shadow-xl shadow-amber-500/20 animate-scale-in">
          <Zap className="h-10 w-10 fill-current" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Victory Achieved!</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          You conquered procrastination with action: <br />
          <span className="font-semibold text-foreground">"{currentTask}"</span>
        </p>
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 max-w-xs">
          🔥 Small wins rewire your brain for forward momentum. Keep this energy going!
        </div>
        <div className="mt-6 flex gap-3">
          <GradientButton onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Another 60s Win
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full max-w-lg mx-auto min-h-115 py-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Victory in 60 Seconds</h3>
            <p className="text-xs text-muted-foreground">
              A high-impact 60-second micro-challenge to spark instant momentum.
            </p>
          </div>
        </div>

        {!isRunning ? (
          <div className="mt-6 space-y-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Choose your micro-win:
            </label>
            <div className="grid gap-2">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedAction(action);
                    setCustomAction("");
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs transition-all border ${
                    selectedAction === action && !customAction
                      ? "border-amber-500/40 bg-amber-500/10 text-foreground font-medium"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs text-muted-foreground block mb-1">
                Or type your own custom micro-win:
              </label>
              <input
                type="text"
                placeholder="e.g., Draft first paragraph of thesis"
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-8">
            {/* Countdown circular display */}
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-amber-500/20 bg-amber-500/5 shadow-2xl shadow-amber-500/10">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                  {timeLeft}
                </span>
                <span className="text-xs uppercase font-semibold text-amber-400 mt-1">Seconds</span>
              </div>
            </div>

            <div className="mt-6 text-center max-w-sm">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mb-1">
                Your Focus Now:
              </span>
              <p className="text-sm font-semibold text-foreground bg-white/5 border border-white/10 p-3 rounded-xl">
                {currentTask}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        {!isRunning ? (
          <div className="w-full flex justify-end">
            <GradientButton onClick={handleStart} className="px-6 py-2.5">
              <Play className="h-4 w-4 mr-2" /> Start 60-Second Sprint
            </GradientButton>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Cancel
            </button>
            <GradientButton
              onClick={handleIWonEarly}
              className="gap-2 bg-emerald-600 hover:bg-emerald-500"
            >
              <CheckCircle2 className="h-4 w-4" /> I Finished Already!
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  );
}
