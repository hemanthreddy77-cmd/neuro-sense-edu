import { useState, useEffect } from "react";
import { Bell, Sparkles, X, ShieldCheck } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

const PERM_PROMPT_KEY = "neurolearn_notif_perm_prompt_dismissed_at";
const PERM_COOL_OFF_MS = 5 * 24 * 60 * 60 * 1000; // 5 days cool-off if dismissed

export function NotificationPermissionModal() {
  const { pushSupported, pushPermission, pushSubscribed, subscribeToPush } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !pushSupported) return;

    // Only prompt if permission is still 'default' (not yet asked or granted)
    if (pushPermission !== "default" || pushSubscribed) {
      return;
    }

    // Check cool-off
    const dismissedAt = localStorage.getItem(PERM_PROMPT_KEY);
    if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > PERM_COOL_OFF_MS) {
      // Show after user has been active on the site for 12 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [pushSupported, pushPermission, pushSubscribed]);

  if (!isOpen || pushPermission !== "default" || !pushSupported) {
    return null;
  }

  const handleEnable = async () => {
    setRequesting(true);
    try {
      await subscribeToPush();
    } finally {
      setRequesting(false);
      setIsOpen(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(PERM_PROMPT_KEY, Date.now().toString());
    } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="perm-modal-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-brand/30 bg-[#0a0d18]/95 p-6 shadow-2xl backdrop-blur-2xl animate-fade-in-up">
        {/* Ambient decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-violet/20 blur-3xl" />

        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand to-violet shadow-lg shadow-brand/20">
            <Bell className="h-6 w-6 text-background" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-glow">
              <Sparkles className="h-3 w-3" />
              Smart Reminders
            </span>
            <h2 id="perm-modal-heading" className="mt-1 text-base font-bold text-foreground">
              Stay Updated with NeuroLearn AI
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Receive optional learning reminders, course updates, and notifications you choose to enable.
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          <span>You have full control over categories and can turn alerts off anytime.</span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleEnable}
            disabled={requesting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-gradient px-5 py-2.5 text-xs font-semibold shadow-lg shadow-brand/25 transition active:scale-95 disabled:opacity-50"
          >
            {requesting ? "Activating…" : "Enable Notifications"}
          </button>
          <button
            onClick={handleDismiss}
            className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
