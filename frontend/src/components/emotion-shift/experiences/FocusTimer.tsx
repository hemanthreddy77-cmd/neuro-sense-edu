import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Target, CheckCircle2 } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface FocusTimerProps {
  onComplete?: () => void;
}

const PRESETS = [
  { label: "15 min", seconds: 15 * 60 },
  { label: "25 min (Pomodoro)", seconds: 25 * 60 },
  { label: "45 min (Deep Work)", seconds: 45 * 60 },
  { label: "5 min (Micro-Focus)", seconds: 5 * 60 },
];

export function FocusTimer({ onComplete }: FocusTimerProps) {
  const [targetSeconds, setTargetSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"off" | "rain" | "waves">("off");
  const [taskNote, setTaskNote] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Synthesize ambient pink/brown noise
  const toggleAmbient = (type: "off" | "rain" | "waves") => {
    setAmbientSound(type);

    if (type === "off") {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown/pink filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === "rain" ? "lowpass" : "bandpass";
      filter.frequency.value = type === "rain" ? 800 : 400;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noiseNodeRef.current = gain;
    } catch {
      // Audio not supported
    }
  };

  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      toggleAmbient("off");
      onComplete?.();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onComplete]);

  const handleSelectPreset = (sec: number) => {
    setIsActive(false);
    setTargetSeconds(sec);
    setSecondsLeft(sec);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(targetSeconds);
    setIsCompleted(false);
    toggleAmbient("off");
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((targetSeconds - secondsLeft) / targetSeconds) * 100;

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto min-h-105 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Deep Focus Session Finished!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You maintained uninterrupted presence for {Math.floor(targetSeconds / 60)} minutes.
        </p>
        <div className="mt-6 flex gap-3">
          <GradientButton onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Start Another Session
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto min-h-115 py-4">
      {/* Preset pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handleSelectPreset(p.seconds)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
              targetSeconds === p.seconds
                ? "bg-brand text-brand-foreground shadow-md"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Target Task Note */}
      <div className="w-full max-w-sm mb-4">
        <input
          type="text"
          placeholder="What is your single focus intention? (Optional)"
          value={taskNote}
          onChange={(e) => setTaskNote(e.target.value)}
          className="w-full text-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/40"
        />
      </div>

      {/* Circular Timer Visual */}
      <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl">
        {/* Progress SVG Ring */}
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="120"
            cy="120"
            r="105"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/5"
            fill="none"
          />
          <circle
            cx="120"
            cy="120"
            r="105"
            stroke="currentColor"
            strokeWidth="6"
            className="text-brand transition-all duration-1000"
            fill="none"
            strokeDasharray={2 * Math.PI * 105}
            strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <span className="text-5xl font-mono font-black tracking-tight text-foreground">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2 flex items-center gap-1 font-semibold">
            <Target className="h-3 w-3 text-brand" /> Focus Time
          </span>
        </div>
      </div>

      {/* Ambient Sound Selector */}
      <div className="flex items-center gap-2 my-4 text-xs text-muted-foreground">
        <span>Soundscape:</span>
        <button
          onClick={() => toggleAmbient("off")}
          className={`px-2.5 py-1 rounded-md border text-[11px] ${
            ambientSound === "off"
              ? "border-white/20 bg-white/10 text-foreground"
              : "border-transparent bg-transparent text-muted-foreground"
          }`}
        >
          Silent
        </button>
        <button
          onClick={() => toggleAmbient("rain")}
          className={`px-2.5 py-1 rounded-md border text-[11px] ${
            ambientSound === "rain"
              ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
              : "border-transparent bg-transparent text-muted-foreground"
          }`}
        >
          Rain Noise
        </button>
        <button
          onClick={() => toggleAmbient("waves")}
          className={`px-2.5 py-1 rounded-md border text-[11px] ${
            ambientSound === "waves"
              ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
              : "border-transparent bg-transparent text-muted-foreground"
          }`}
        >
          Brown Noise
        </button>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleReset}
          className="p-3 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {!isActive ? (
          <GradientButton onClick={() => setIsActive(true)} className="px-8 py-2.5">
            <Play className="h-4 w-4 mr-2" /> Start Focus
          </GradientButton>
        ) : (
          <button
            onClick={() => setIsActive(false)}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all shadow-md"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
      </div>
    </div>
  );
}
