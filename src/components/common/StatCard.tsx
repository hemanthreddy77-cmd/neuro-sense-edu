import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  className,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
  iconClass?: string;
}) {
  return (
    <GlassCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand",
            iconClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-medium",
            trend.positive ? "text-emotion-happy" : "text-emotion-angry",
          )}
        >
          {trend.value}
        </div>
      )}
    </GlassCard>
  );
}
