import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, X } from "lucide-react";

export function PwaUpdateToast() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // Check if a worker is already waiting
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdate(true);
      }

      // Listen for new updates arriving
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });
    });

    // Reload once the new service worker activates
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md sm:bottom-6 animate-fade-in"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand/40 bg-[#0a0d18]/95 p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-brand to-violet text-background">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">Update Available</p>
            <p className="text-[11px] text-muted-foreground">A fresh version of NeuroLearn AI is ready.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdate}
            className="flex items-center gap-1 rounded-xl bg-linear-to-r from-brand to-violet px-3 py-1.5 text-xs font-semibold text-background shadow-md hover:brightness-110 transition active:scale-95"
          >
            <RefreshCw className="h-3 w-3" />
            Update
          </button>
          <button
            onClick={() => setShowUpdate(false)}
            aria-label="Dismiss update"
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
