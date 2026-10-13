import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type AppNotification,
  type NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/types/notifications";
import { playNotificationSound } from "@/lib/notification-sound";
import { api } from "@/lib/api-client";

interface NotificationContextValue {
  notifications: AppNotification[];
  activeToasts: AppNotification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isDrawerOpen: boolean;
  pushSupported: boolean;
  pushSubscribed: boolean;
  pushPermission: NotificationPermission;
  addNotification: (
    notif: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => string;
  dismissToast: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  updatePreferences: (
    partial: Partial<NotificationPreferences>,
  ) => Promise<void>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
  sendTestPush: () => Promise<{ success: boolean; message?: string }>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_NOTIFS_KEY = "neurolearn_in_app_notifications";
const STORAGE_PREFS_KEY = "neurolearn_notification_preferences";
const MAX_STORED_NOTIFICATIONS = 50;
const MAX_CONCURRENT_TOASTS = 3;

function isQuietHours(start: string, end: string): boolean {
  try {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = start.split(":").map(Number);
    const startMins = sh * 60 + sm;

    const [eh, em] = end.split(":").map(Number);
    const endMins = eh * 60 + em;

    if (startMins <= endMins) {
      return currentMins >= startMins && currentMins <= endMins;
    } else {
      // Wraps midnight (e.g. 22:00 to 08:00)
      return currentMins >= startMins || currentMins <= endMins;
    }
  } catch {
    return false;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      return saved ? { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_NOTIFICATION_PREFERENCES;
    } catch {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  // Save notifications to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifications.slice(0, MAX_STORED_NOTIFICATIONS)));
    } catch {}
  }, [notifications]);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  // Check Push API support and current permission
  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setPushSupported(supported);

    if (supported) {
      setPushPermission(Notification.permission);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setPushSubscribed(!!sub);
        });
      }).catch(() => {});
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
    dismissToast(id);
  }, [dismissToast]);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "timestamp" | "read">): string => {
      // 1. Check if notifications are globally enabled
      if (!preferences.enabled) return "";

      // 2. Check category filter
      const categoryEnabled = preferences.categories[notif.category];
      if (categoryEnabled === false) return "";

      const newId = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const newNotif: AppNotification = {
        ...notif,
        id: newId,
        timestamp: Date.now(),
        read: false,
      };

      // Add to notifications drawer list
      setNotifications((current) => [newNotif, ...current].slice(0, MAX_STORED_NOTIFICATIONS));

      // Check quiet hours
      const inQuiet =
        preferences.quietHours.enabled &&
        isQuietHours(preferences.quietHours.start, preferences.quietHours.end);

      // Trigger sound if allowed and not in quiet hours
      if (preferences.soundEnabled && !inQuiet) {
        playNotificationSound(notif.type);
      }

      // Add to visible toast container if not in quiet hours
      if (!inQuiet) {
        setActiveToasts((current) => [newNotif, ...current.slice(0, MAX_CONCURRENT_TOASTS - 1)]);

        // Auto-dismiss transient toasts after 6s (unless marked persistent)
        if (!notif.persistent) {
          setTimeout(() => {
            dismissToast(newId);
          }, 6000);
        }
      }

      return newId;
    },
    [preferences, dismissToast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setActiveToasts([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const updatePreferences = useCallback(
    async (partial: Partial<NotificationPreferences>) => {
      setPreferences((current) => {
        const next = { ...current, ...partial };
        // Sync with backend if available
        api.notifications.updatePreferences(next).catch(() => {});
        return next;
      });
    },
    []
  );

  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!pushSupported) return false;

    try {
      const perm = await Notification.requestPermission();
      setPushPermission(perm);
      if (perm !== "granted") return false;

      const reg = await navigator.serviceWorker.ready;

      // Fetch VAPID public key from backend
      const keyRes = await api.notifications.getVapidPublicKey();
      if (!keyRes?.publicKey) {
        console.warn("[Push] Missing VAPID public key from server");
        return false;
      }

      // Convert base64 VAPID key to Uint8Array
      const padding = "=".repeat((4 - (keyRes.publicKey.length % 4)) % 4);
      const base64 = (keyRes.publicKey + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray,
      });

      // Send subscription to backend
      await api.notifications.subscribe(subscription);
      setPushSubscribed(true);

      addNotification({
        type: "success",
        category: "system_updates",
        title: "Push Notifications Enabled",
        message: "You will now receive real-time learning updates and reminders.",
      });

      return true;
    } catch (err) {
      console.error("[Push] Failed to subscribe to push notifications:", err);
      return false;
    }
  }, [pushSupported, addNotification]);

  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    if (!pushSupported) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await api.notifications.unsubscribe(sub.endpoint);
        await sub.unsubscribe();
      }
      setPushSubscribed(false);

      addNotification({
        type: "info",
        category: "system_updates",
        title: "Push Notifications Disabled",
        message: "You will only receive in-app notifications while browsing.",
      });

      return true;
    } catch (err) {
      console.error("[Push] Failed to unsubscribe:", err);
      return false;
    }
  }, [pushSupported, addNotification]);

  const sendTestPush = useCallback(async () => {
    try {
      return await api.notifications.sendTestPush();
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to trigger test push.",
      };
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        activeToasts,
        unreadCount,
        preferences,
        isDrawerOpen,
        pushSupported,
        pushSubscribed,
        pushPermission,
        addNotification,
        dismissToast,
        dismissNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        openDrawer,
        closeDrawer,
        updatePreferences,
        subscribeToPush,
        unsubscribeFromPush,
        sendTestPush,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
