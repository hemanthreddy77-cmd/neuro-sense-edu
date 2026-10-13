import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Info,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Trophy,
  BookOpen,
  Brain,
  X,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import type { NotificationType } from "@/types/notifications";

function getIconForType(type: NotificationType) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "achievement":
      return <Trophy className="h-4 w-4 text-amber-400" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    case "error":
      return <AlertOctagon className="h-4 w-4 text-rose-400" />;
    case "reminder":
      return <Clock className="h-4 w-4 text-cyan-400" />;
    case "course_recommendation":
      return <BookOpen className="h-4 w-4 text-violet-400" />;
    case "emotionshift_suggestion":
      return <Brain className="h-4 w-4 text-teal-400" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-brand-glow" />;
  }
}

function getBorderGradient(type: NotificationType) {
  switch (type) {
    case "achievement":
      return "border-amber-500/40 shadow-amber-500/10";
    case "success":
      return "border-emerald-500/40 shadow-emerald-500/10";
    case "warning":
      return "border-amber-500/40 shadow-amber-500/10";
    case "error":
      return "border-rose-500/40 shadow-rose-500/10";
    case "emotionshift_suggestion":
      return "border-teal-500/40 shadow-teal-500/10";
    default:
      return "border-brand/40 shadow-brand/10";
  }
}

export function NotificationToastContainer() {
  const { activeToasts, dismissToast, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (activeToasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`pointer-events-auto relative overflow-hidden rounded-2xl border bg-[#0a0d18]/95 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-fade-in-up ${getBorderGradient(
            toast.type
          )}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 mt-0.5">
              {getIconForType(toast.type)}
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs font-semibold text-foreground truncate">{toast.title}</h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {toast.message}
              </p>

              {toast.actionUrl && (
                <button
                  onClick={() => {
                    markAsRead(toast.id);
                    dismissToast(toast.id);
                    navigate({ to: toast.actionUrl as any });
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-glow hover:underline transition"
                >
                  {toast.actionLabel || "View now"}
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
