import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !justReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md sm:bottom-6 animate-fade-in"
    >
      {isOffline ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-[#120a10]/95 px-4 py-3 text-xs shadow-2xl backdrop-blur-xl text-red-200">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
              <WifiOff className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-white">You are offline</p>
              <p className="text-[11px] text-red-300/80">
                Using cached shell. Lessons will sync when reconnected.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-medium text-red-200 hover:bg-red-500/20 transition"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-[#071710]/95 px-4 py-3 text-xs shadow-2xl backdrop-blur-xl text-emerald-200">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="font-semibold text-white">Back online</p>
          <span className="text-emerald-300/80">— Syncing your latest learning progress…</span>
        </div>
      )}
    </div>
  );
}
