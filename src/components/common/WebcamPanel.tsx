import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, CameraOff, Activity } from "lucide-react";
import { EMOTIONS, type EmotionKey } from "@/data/mockData";

const ROTATION: EmotionKey[] = ["focused", "happy", "curious", "confused", "motivated", "bored", "focused", "happy"];

export function WebcamPanel({
  onEmotionChange,
}: {
  onEmotionChange?: (emotion: EmotionKey, confidence: number) => void;
}) {
  const [enabled, setEnabled] = useState(true);
  const [emotion, setEmotion] = useState<EmotionKey>("focused");
  const [confidence, setConfidence] = useState(72);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % ROTATION.length;
      const next = ROTATION[indexRef.current];
      const c = Math.round(62 + Math.random() * 33);
      setEmotion(next);
      setConfidence(c);
      onEmotionChange?.(next, c);
    }, 6000);
    return () => clearInterval(id);
  }, [enabled, onEmotionChange]);

  const e = EMOTIONS[emotion];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="glass-card relative overflow-hidden rounded-2xl">
        <div className="relative aspect-video w-full bg-black">
          {enabled ? (
            <Webcam
              audio={false}
              mirrored
              videoConstraints={{ facingMode: "user" }}
              className="h-full w-full object-cover"
              onUserMediaError={() => setEnabled(false)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <CameraOff className="mx-auto h-8 w-8" />
                <div className="mt-2 text-sm">Webcam disabled</div>
              </div>
            </div>
          )}

          {enabled && (
            <>
              {/* Detection overlay */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[55%] w-[45%] -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 rounded-xl border border-brand/60 animate-pulse-ring" />
                  {/* corners */}
                  {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((p) => (
                    <span key={p} className={`absolute ${p} h-4 w-4 border-brand`}>
                      <span className={`absolute ${p.includes("top") ? "top-0" : "bottom-0"} ${p.includes("left") ? "left-0" : "right-0"} h-full w-full border-2 ${p.includes("top") ? "border-t" : "border-b"} ${p.includes("left") ? "border-l" : "border-r"} rounded-sm`} />
                    </span>
                  ))}
                </div>
              </div>

              {/* status pill */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emotion-happy animate-pulse" />
                Live detection
              </div>
            </>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Detected emotion</div>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `color-mix(in oklab, ${e.hex} 18%, transparent)` }}
          >
            <span aria-hidden>{e.emoji}</span>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: e.hex }}>{e.label}</div>
            <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Activity className="h-3 w-3" /> {confidence}% confidence
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${confidence}%`,
                background: `linear-gradient(90deg, ${e.hex}, color-mix(in oklab, ${e.hex} 60%, white))`,
              }}
            />
          </div>
        </div>
        <button
          onClick={() => setEnabled((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition"
        >
          {enabled ? <CameraOff className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />}
          {enabled ? "Pause camera" : "Enable camera"}
        </button>
      </div>
    </div>
  );
}
