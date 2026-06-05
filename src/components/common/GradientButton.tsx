import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

export function GradientButton({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/60 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<Variant, string> = {
    primary:
      "btn-gradient shadow-[0_10px_30px_-10px_oklch(0.68_0.18_255_/_0.6)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]",
    outline:
      "border border-white/20 text-foreground bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30",
    ghost:
      "text-foreground/80 hover:text-foreground hover:bg-white/5",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
