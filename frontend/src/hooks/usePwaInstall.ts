import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "neurolearn_pwa_install_dismissed_at";
const DISMISS_COOL_OFF_MS = 3 * 24 * 60 * 60 * 1000; // 3 days cool-off before suggesting again

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|firefox|fxios/.test(userAgent);
    setIsIos(isIosDevice && isSafari);

    // 3. Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);

      // Check dismiss cool-off
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > DISMISS_COOL_OFF_MS) {
        // Delay showing the popup so it doesn't disturb initial page load
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    // 4. Listen for browser confirmed installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowPrompt(false);
      setInstallSuccess(true);
      localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstallSuccess(true);
        setShowPrompt(false);
        setDeferredPrompt(null);
        return true;
      } else {
        // User dismissed native prompt
        dismissPrompt();
        return false;
      }
    } catch (err) {
      console.warn("[PWA] Installation prompt failed:", err);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  }, []);

  const manuallyOpenPrompt = useCallback(() => {
    setShowPrompt(true);
  }, []);

  return {
    isInstallable,
    isInstalled,
    isIos,
    showPrompt,
    installSuccess,
    triggerInstall,
    dismissPrompt,
    manuallyOpenPrompt,
  };
}
