import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface BreathingExperienceProps {
  onComplete?: () => void;
}

type Technique = {
  name: string;
  desc: string;
  phases: { name: string; duration: number; text: string }[];
};

const TECHNIQUES: Technique[] = [
  {
    name: "Box Breathing (4-4-4-4)",
    desc: "Used by athletes and Navy SEALs for rapid mental reset and focus.",
    phases: [
      { name: "inhale", duration: 4, text: "Breathe In Slowly" },
      { name: "hold1", duration: 4, text: "Hold Your Breath" },
      { name: "exhale", duration: 4, text: "Breathe Out Gently" },
      { name: "hold2", duration: 4, text: "Hold Empty" },
    ],
  },
  {
    name: "4-7-8 Relaxing Breath",
    desc: "Dr. Andrew Weil's natural tranquilizer for the nervous system.",
    phases: [
      { name: "inhale", duration: 4, text: "Inhale Through Nose" },
      { name: "hold1", duration: 7, text: "Hold with Ease" },
      { name: "exhale", duration: 8, text: "Exhale Fully with Whoosh" },
    ],
  },
  {
    name: "Equal Calm (4-4)",
    desc: "A simple balanced rhythm to steady heart rate and calm racing thoughts.",
    phases: [
      { name: "inhale", duration: 4, text: "Breathe In Peace" },
      { name: "exhale", duration: 4, text: "Breathe Out Tension" },
    ],
  },
];

export function BreathingExperience({ onComplete }: BreathingExperienceProps) {
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(TECHNIQUES[0].phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentTechnique = TECHNIQUES[selectedTechIdx];
  const currentPhase = currentTechnique.phases[phaseIdx];

  // Web Audio tone for gentle chime
  const playChime = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // Audio not supported or blocked
    }
  };

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const playChimeRef = useRef(playChime);
  playChimeRef.current = playChime;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);

        setSecondsLeftInPhase((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIdx = (phaseIdx + 1) % currentTechnique.phases.length;
            setPhaseIdx(nextIdx);

            if (nextIdx === 0) {
              setCompletedCycles((c) => {
                const updated = c + 1;
                if (updated >= 5) {
                  // After 5 full cycles, mark as completed
                  setIsFinished(true);
                  setIsActive(false);
                  onCompleteRef.current?.();
                }
                return updated;
              });
            }

            // Play gentle tone depending on phase
            if (currentTechnique.phases[nextIdx].name.includes("inhale")) {
              playChimeRef.current(520);
            } else if (currentTechnique.phases[nextIdx].name.includes("exhale")) {
              playChimeRef.current(390);
            } else {
              playChimeRef.current(440);
            }

            return currentTechnique.phases[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phaseIdx, currentTechnique, isFinished]);

  const handleStart = () => {
    setIsActive(true);
    setIsFinished(false);
    playChime(520);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIdx(0);
    setSecondsLeftInPhase(currentTechnique.phases[0].duration);
    setCompletedCycles(0);
    setTotalSeconds(0);
    setIsFinished(false);
  };

  const handleTechniqueChange = (idx: number) => {
    setSelectedTechIdx(idx);
    setIsActive(false);
    setPhaseIdx(0);
    setSecondsLeftInPhase(TECHNIQUES[idx].phases[0].duration);
    setCompletedCycles(0);
    setTotalSeconds(0);
    setIsFinished(false);
  };

  // Determine breathing orb scale and glow based on phase
  const isInhale = currentPhase.name.includes("inhale");
  const isHold = currentPhase.name.includes("hold");

  const orbScale = isInhale ? "scale-125" : isHold ? "scale-125" : "scale-75";
  const orbGlow = isInhale
    ? "shadow-[0_0_80px_rgba(56,189,248,0.5)]"
    : isHold
      ? "shadow-[0_0_90px_rgba(168,85,247,0.5)]"
      : "shadow-[0_0_30px_rgba(99,102,241,0.2)]";

  return (
    <div className="flex flex-col items-center justify-between min-h-125 w-full max-w-2xl mx-auto py-6">
      {/* Technique selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {TECHNIQUES.map((tech, idx) => (
          <button
            key={tech.name}
            onClick={() => handleTechniqueChange(idx)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedTechIdx === idx
                ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20 scale-105"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {tech.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-md mb-8">
        {currentTechnique.desc}
      </p>

      {/* Main Breathing Visualizer */}
      <div className="relative flex flex-col items-center justify-center my-6">
        {/* Outer Ripple Rings */}
        <div
          className={`absolute h-72 w-72 rounded-full border border-brand/20 transition-all duration-1000 ${
            isActive ? (isInhale ? "scale-150 opacity-40" : "scale-100 opacity-10") : "opacity-0"
          }`}
        />
        <div
          className={`absolute h-84 w-84 rounded-full border border-violet/20 transition-all duration-1000 delay-100 ${
            isActive ? (isInhale ? "scale-125 opacity-30" : "scale-90 opacity-5") : "opacity-0"
          }`}
        />

        {/* The Core Breathing Orb */}
        <div
          className={`relative flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 text-white transition-all duration-1000 ease-in-out ${orbScale} ${orbGlow}`}
        >
          {/* Inner frosted ring */}
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
              {currentPhase.name.toUpperCase()}
            </span>
            <span className="text-4xl font-extrabold tracking-tight drop-shadow-md">
              {secondsLeftInPhase}s
            </span>
            <span className="text-xs text-white/90 mt-2 font-medium max-w-32.5 leading-tight">
              {currentPhase.text}
            </span>
          </div>
        </div>
      </div>

      {/* Completion message */}
      {isFinished ? (
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 my-4 animate-fade-in">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
          <h4 className="font-semibold text-foreground">5 Cycles Completed!</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Great job! Take a moment to notice how your body and mind feel right now.
          </p>
        </div>
      ) : null}

      {/* Stats counter */}
      <div className="flex items-center gap-6 my-4 text-xs text-muted-foreground">
        <div>
          Cycles: <span className="font-semibold text-foreground">{completedCycles} / 5</span>
        </div>
        <div>
          Total Time:{" "}
          <span className="font-semibold text-foreground">
            {Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {!isActive ? (
          <GradientButton onClick={handleStart} className="px-6 py-2.5">
            <Play className="h-4 w-4 mr-2" /> {isFinished ? "Breathe Again" : "Start"}
          </GradientButton>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all shadow-md"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}

        <button
          onClick={handleReset}
          className="p-3 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
