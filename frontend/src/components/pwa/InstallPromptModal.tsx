import { useState } from "react";
import { Download, Share2, PlusSquare, CheckCircle2, X, Sparkles } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface InstallPromptModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function InstallPromptModal({ forceOpen, onClose }: InstallPromptModalProps) {
  const {
    isInstallable,
    isInstalled,
    isIos,
    showPrompt,
    installSuccess,
    triggerInstall,
    dismissPrompt,
  } = usePwaInstall();

  const [installing, setInstalling] = useState(false);

  const isOpen = forceOpen !== undefined ? forceOpen : showPrompt;

  // Don't show if already installed (unless forced manually)
  if (isInstalled && !forceOpen) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await triggerInstall();
    } finally {
      setInstalling(false);
      if (onClose) onClose();
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    if (onClose) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-pwa-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0a0d18]/95 p-6 shadow-2xl backdrop-blur-2xl animate-fade-in-up">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet/20 blur-3xl" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand to-violet shadow-lg shadow-brand/20">
            <img src="/icons/icon-192x192.png" alt="NeuroLearn AI" className="h-10 w-10 rounded-xl" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0d18] border border-brand/50 text-[10px]">
              <Sparkles className="h-3 w-3 text-brand" />
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-glow">
              Install Progressive App
            </span>
            <h2 id="install-pwa-heading" className="mt-1 text-lg font-bold text-foreground">
              Install NeuroLearn AI
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Get quick access to your learning dashboard, interactive experiences, and personalized learning tools.
        </p>

        {installSuccess ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>NeuroLearn AI is successfully installed on your device!</span>
          </div>
        ) : isInstallable ? (
          /* Native 1-click install (Chrome, Edge, Android) */
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-gradient px-5 py-2.5 text-xs font-semibold shadow-lg shadow-brand/25 transition active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {installing ? "Installing…" : "Install App"}
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              Maybe Later
            </button>
          </div>
        ) : isIos ? (
          /* iOS Safari Manual Instructions */
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-foreground/80 space-y-2">
              <p className="font-semibold text-brand-glow flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-brand" />
                How to install on iPhone & iPad:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-muted-foreground">
                <li>
                  Tap the <strong className="text-foreground">Share</strong> icon at the bottom of Safari.
                </li>
                <li>
                  Scroll down and choose{" "}
                  <strong className="text-foreground inline-flex items-center gap-1">
                    <PlusSquare className="h-3 w-3" /> Add to Home Screen
                  </strong>.
                </li>
                <li>Tap <strong className="text-foreground">Add</strong> in the top right.</li>
              </ol>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10 transition"
            >
              Got it
            </button>
          </div>
        ) : (
          /* Desktop browser without native prompt (e.g. Firefox) */
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-muted-foreground">
              To install in this browser, click the <strong className="text-foreground">Install icon</strong> in your browser address bar or add this page to your bookmarks.
            </div>
            <button
              onClick={handleDismiss}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10 transition"
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
