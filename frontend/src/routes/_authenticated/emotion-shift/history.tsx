import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { SCENARIO_CATEGORIES } from "@/data/emotionShiftData";
import { History, Play, Trash2, ArrowLeft, Clock, Calendar, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/emotion-shift/history")({
  head: () => ({
    meta: [
      { title: "Activity History — EmotionShift AI" },
      {
        name: "description",
        content: "View your history of completed EmotionShift interactive experiences.",
      },
    ],
  }),
  component: EmotionShiftHistoryPage,
});

type HistoryItem = {
  id: number;
  scenarioId: string;
  scenarioTitle: string;
  categorySlug: string;
  timestamp: string;
  durationLabel: string;
};

function EmotionShiftHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("neuro_emotionshift_history") || "[]");
      setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your experience history?")) {
      localStorage.removeItem("neuro_emotionshift_history");
      setHistory([]);
    }
  };

  return (
    <AppShell title="Activity History">
      <div className="space-y-8 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/emotion-shift"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to EmotionShift
            </Link>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Your Experience History
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review previous sessions and track the rituals and activities that help you reset.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear History
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Total Sessions
            </span>
            <div className="mt-2 text-2xl font-bold text-foreground">{history.length}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Most Practiced
            </span>
            <div className="mt-2 text-base font-bold text-brand truncate">
              {history.length > 0
                ? SCENARIO_CATEGORIES.find((c) => c.slug === history[0].categorySlug)?.title ||
                  "Mixed"
                : "None yet"}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Privacy Status
            </span>
            <div className="mt-2 text-xs text-emerald-400 font-medium">
              Saved strictly on device
            </div>
          </GlassCard>
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => {
              const cat = SCENARIO_CATEGORIES.find((c) => c.slug === item.categorySlug);
              const dateStr = new Date(item.timestamp).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: cat
                          ? `color-mix(in oklab, ${cat.accentColor} 18%, transparent)`
                          : "rgba(255,255,255,0.05)",
                        color: cat?.accentColor || "#fff",
                      }}
                    >
                      {cat?.icon ? (
                        <cat.icon className="h-5 w-5" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {item.scenarioTitle}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {dateStr}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.durationLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/emotion-shift/play/$scenarioId"
                    params={{ scenarioId: item.scenarioId }}
                  >
                    <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors">
                      <Play className="h-3.5 w-3.5 text-brand" /> Play Again
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <History className="h-10 w-10 text-muted-foreground mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-foreground">No sessions completed yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              When you finish guided breathing, a focus timer, or any interactive game, it will
              appear here.
            </p>
            <Link to="/emotion-shift" className="mt-4">
              <GradientButton className="text-xs">Explore EmotionShift</GradientButton>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
