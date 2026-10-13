import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  Check,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Moon,
  Send,
  Sliders,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import type { NotificationCategory } from "@/types/notifications";

export function NotificationCenterDrawer() {
  const {
    notifications,
    unreadCount,
    preferences,
    isDrawerOpen,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    clearAll,
    dismissNotification,
    updatePreferences,
    pushSupported,
    pushSubscribed,
    pushPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestPush,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "learning" | "emotionshift" | "settings">("all");
  const [testingPush, setTestingPush] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "learning") {
      return (
        n.category === "learning_reminders" ||
        n.category === "course_recommendations" ||
        n.category === "achievements"
      );
    }
    if (activeTab === "emotionshift") {
      return n.category === "emotionshift_suggestions";
    }
    return true;
  });

  const handleTestPushClick = async () => {
    setTestingPush(true);
    setPushStatusMessage(null);
    try {
      const res = await sendTestPush();
      if (res.success) {
        setPushStatusMessage("✅ Push sent! Check your device or notification center.");
      } else {
        setPushStatusMessage(`⚠️ ${res.message || "Could not deliver push"}`);
      }
    } catch {
      setPushStatusMessage("❌ Failed to send test push.");
    } finally {
      setTestingPush(false);
    }
  };

  const toggleCategory = (catKey: NotificationCategory) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [catKey]: !preferences.categories[catKey],
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Notifications Center"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#07090e]/95 p-5 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-brand to-violet text-background">
              <Bell className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="rounded-full bg-brand/20 border border-brand/40 px-2 py-0.5 text-[10px] font-semibold text-brand-glow">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-muted-foreground">Smart learning & activity updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && activeTab !== "settings" && (
              <>
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={closeDrawer}
              aria-label="Close drawer"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-white/10 text-xs">
          {(
            [
              { id: "all", label: "All" },
              { id: "learning", label: "Learning" },
              { id: "emotionshift", label: "EmotionShift" },
              { id: "settings", label: "Preferences" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3 py-1.5 font-medium transition ${
                activeTab === tab.id
                  ? "bg-brand/20 border border-brand/40 text-brand-glow"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {activeTab === "settings" ? (
            /* Settings & Web Push Tab */
            <div className="space-y-4 text-xs">
              {/* Web Push Toggle */}
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-brand" />
                      Browser Push Notifications
                    </h4>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Receive reminders even when the tab is closed.
                    </p>
                  </div>

                  {pushSupported ? (
                    <button
                      onClick={() => (pushSubscribed ? unsubscribeFromPush() : subscribeToPush())}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        pushSubscribed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "btn-gradient text-background"
                      }`}
                    >
                      {pushSubscribed ? "Subscribed" : "Enable Push"}
                    </button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Not supported</span>
                  )}
                </div>

                {pushPermission === "denied" && (
                  <p className="text-[11px] text-amber-400 bg-amber-400/10 rounded-lg p-2 border border-amber-400/20">
                    Notifications are blocked in your browser settings. Please click the padlock in your address bar to re-enable.
                  </p>
                )}

                {pushSubscribed && (
                  <div className="pt-2 border-t border-brand/20 flex flex-col gap-2">
                    <button
                      onClick={handleTestPushClick}
                      disabled={testingPush}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-semibold text-brand-glow hover:bg-brand/20 transition disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" />
                      {testingPush ? "Sending Test Push…" : "Send Test Push Notification"}
                    </button>
                    {pushStatusMessage && (
                      <p className="text-[11px] text-muted-foreground text-center animate-fade-in">
                        {pushStatusMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* General Toggles */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-brand" />
                  General Preferences
                </h4>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Enable all in-app notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.enabled}
                    onChange={(e) => updatePreferences({ enabled: e.target.checked })}
                    className="accent-cyan-500 h-4 w-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    {preferences.soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-brand" /> : <VolumeX className="h-3.5 w-3.5" />}
                    Sound chime on notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                    className="accent-cyan-500 h-4 w-4 rounded"
                  />
                </label>
              </div>

              {/* Category Controls */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5">
                <h4 className="font-semibold text-foreground">Notification Categories</h4>

                {(
                  [
                    { key: "learning_reminders", label: "Learning reminders & progress" },
                    { key: "course_recommendations", label: "Course recommendations" },
                    { key: "achievements", label: "Milestones & achievements" },
                    { key: "emotionshift_suggestions", label: "EmotionShift mindful break suggestions" },
                    { key: "system_updates", label: "Platform & system announcements" },
                  ] as const
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <input
                      type="checkbox"
                      checked={preferences.categories[key]}
                      onChange={() => toggleCategory(key)}
                      className="accent-cyan-500 h-4 w-4 rounded"
                    />
                  </label>
                ))}
              </div>

              {/* Quiet Hours */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-violet-400" />
                    Quiet Hours
                  </h4>
                  <input
                    type="checkbox"
                    checked={preferences.quietHours.enabled}
                    onChange={(e) =>
                      updatePreferences({
                        quietHours: { ...preferences.quietHours, enabled: e.target.checked },
                      })
                    }
                    className="accent-cyan-500 h-4 w-4 rounded"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mutes popups and sounds during your chosen resting window.
                </p>
                {preferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">Start</span>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) =>
                          updatePreferences({
                            quietHours: { ...preferences.quietHours, start: e.target.value },
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-foreground"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">End</span>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) =>
                          updatePreferences({
                            quietHours: { ...preferences.quietHours, end: e.target.value },
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-foreground"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-3 text-muted-foreground">
                <BellOff className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="mt-1 text-[11px] max-w-xs">
                You have no notifications in this category. We will notify you when new learning activities occur.
              </p>
            </div>
          ) : (
            /* Notifications list */
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`relative rounded-2xl border p-3.5 transition cursor-pointer ${
                  notif.read
                    ? "border-white/5 bg-white/2 hover:bg-white/5 text-muted-foreground"
                    : "border-brand/30 bg-brand/5 hover:bg-brand/10 text-foreground"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />}
                      <h4 className="text-xs font-semibold text-foreground">{notif.title}</h4>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {notif.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                            closeDrawer();
                            navigate({ to: notif.actionUrl as any });
                          }}
                          className="inline-flex items-center gap-1 text-brand-glow font-medium hover:underline"
                        >
                          {notif.actionLabel || "Open"}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notif.id);
                    }}
                    title="Dismiss"
                    className="p-1 text-muted-foreground hover:text-foreground transition rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
