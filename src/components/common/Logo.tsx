import { Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-violet shadow-[0_8px_24px_-8px_oklch(0.68_0.18_255_/_0.7)]">
        <Brain className="h-5 w-5 text-background" />
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand to-violet opacity-0 blur-md transition group-hover:opacity-60" />
      </span>
      {withText && (
        <span className="text-base font-bold tracking-tight">
          <span className="text-foreground">Neuro</span>
          <span className="text-gradient">Learn</span>
          <span className="text-foreground/70 ml-1 text-xs font-medium align-middle">AI</span>
        </span>
      )}
    </Link>
  );
}
