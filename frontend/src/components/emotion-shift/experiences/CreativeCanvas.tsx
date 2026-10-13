import { useState, useRef, useEffect } from "react";
import { Download, Trash2, Sparkles } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface CreativeCanvasProps {
  onComplete?: () => void;
}

const COLORS = [
  "#38bdf8", // Sky Blue
  "#818cf8", // Indigo
  "#c084fc", // Purple
  "#f472b6", // Pink
  "#fb7185", // Rose
  "#34d399", // Emerald
  "#fbbf24", // Amber
  "#ffffff", // White
  "#0f172a", // Eraser / Background dark
];

const PROMPTS = [
  "Draw your current mood as abstract weather (storm, sunrise, calm mist)",
  "Sketch a mythical creature or futuristic constellation",
  "Draw a door to a secret garden or alien library",
  "Create a visual pattern using only spirals and triangles",
  "Design a glowing neon plant that blooms in deep space",
];

export function CreativeCanvas({ onComplete }: CreativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill dark background
    ctx.fillStyle = "#0c1021";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0c1021";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `emotion-art-${Date.now()}.png`;
    link.href = url;
    link.click();
    onComplete?.();
  };

  const handleNextPrompt = () => {
    setPromptIdx((p) => (p + 1) % PROMPTS.length);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto py-2">
      {/* Inspiration Prompt Banner */}
      <div className="w-full mb-4 flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
          <span className="text-foreground font-medium">{PROMPTS[promptIdx]}</span>
        </div>
        <button
          onClick={handleNextPrompt}
          className="text-purple-300 hover:text-white shrink-0 ml-3 underline"
        >
          New prompt
        </button>
      </div>

      {/* Drawing Toolbar */}
      <div className="flex flex-wrap items-center justify-between w-full gap-3 mb-3 px-1">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setCurrentColor(c)}
              className={`h-6 w-6 rounded-full border transition-all ${
                currentColor === c ? "scale-125 border-white ring-2 ring-brand" : "border-white/20"
              }`}
              style={{ background: c }}
              title={c === "#0f172a" ? "Eraser" : c}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-2">
          {[2, 6, 12, 20].map((sz) => (
            <button
              key={sz}
              onClick={() => setBrushSize(sz)}
              className={`flex items-center justify-center h-7 w-7 rounded-lg border text-xs font-semibold ${
                brushSize === sz
                  ? "border-brand bg-brand/20 text-brand"
                  : "border-white/10 bg-white/5 text-muted-foreground"
              }`}
            >
              <span
                className="rounded-full bg-current"
                style={{ width: Math.min(sz, 14), height: Math.min(sz, 14) }}
              />
            </button>
          ))}
        </div>

        {/* Canvas action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-rose-400 transition-colors"
            title="Clear canvas"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            title="Download drawing"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair touch-none bg-[#0c1021]"
        />
      </div>

      {/* Save / Complete prompt */}
      <div className="w-full flex items-center justify-between pt-4 mt-2">
        <span className="text-xs text-muted-foreground">
          {hasDrawn
            ? "Your imagination has no constraints."
            : "Click and drag to express your thoughts visually."}
        </span>
        <GradientButton onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" /> Save Art & Finish
        </GradientButton>
      </div>
    </div>
  );
}
