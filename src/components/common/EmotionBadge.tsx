import { EMOTIONS, type EmotionKey } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function EmotionBadge({
  emotion,
  size = "sm",
  className,
}: {
  emotion: EmotionKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const e = EMOTIONS[emotion];
  const sizes = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        sizes[size],
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${e.hex} 16%, transparent)`,
        borderColor: `color-mix(in oklab, ${e.hex} 38%, transparent)`,
        color: e.hex,
      }}
    >
      <span aria-hidden>{e.emoji}</span>
      {e.label}
    </span>
  );
}
