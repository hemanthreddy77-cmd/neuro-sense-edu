import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { EmotionShiftHero } from "@/components/emotion-shift/EmotionShiftHero";
import { ScenarioCategoryGrid } from "@/components/emotion-shift/ScenarioCategoryGrid";
import { ScenarioCard } from "@/components/emotion-shift/ScenarioCard";
import { MoodCheckIn } from "@/components/emotion-shift/MoodCheckIn";
import { SCENARIOS } from "@/data/emotionShiftData";
import { Sparkles, History, Camera, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/emotion-shift/")({
  head: () => ({
    meta: [
      { title: "EmotionShift AI — Interactive Emotion Experience Platform" },
      {
        name: "description",
        content:
          "Explore emotion-adaptive interactive experiences, games, calm resets, and focus activities.",
      },
    ],
  }),
  component: EmotionShiftLandingPage,
});

function EmotionShiftLandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moodModalOpen, setMoodModalOpen] = useState(false);

  // Top featured scenarios across categories
  const featuredScenarios = SCENARIOS.slice(0, 4);

  return (
    <AppShell title="EmotionShift AI">
      <div className="space-y-12 pb-12">
        {/* Top Hero Section */}
        <EmotionShiftHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMoodCheckIn={() => setMoodModalOpen(true)}
        />

        {/* 8 Core Categories Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-brand tracking-widest uppercase">
                Choose Your Vibe
              </span>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1">
                Explore by Experience Type
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Select an interactive path designed around what you need right now: calmness, play,
                concentration, or motivation.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/emotion-shift/history">
                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10 transition-colors">
                  <History className="h-4 w-4 text-muted-foreground" />
                  My Activity History
                </button>
              </Link>
            </div>
          </div>

          <ScenarioCategoryGrid />
        </section>

        {/* Featured Experiences Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-brand tracking-widest uppercase">
                Popular Activities
              </span>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl mt-1">
                Recommended Experiences
              </h2>
            </div>
            <Link
              to="/emotion-shift/scenarios"
              className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
            >
              Browse all {SCENARIOS.length} scenarios <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredScenarios.map((sc) => (
              <ScenarioCard key={sc.id} scenario={sc} />
            ))}
          </div>
        </section>

        {/* AI & Facial Expression Recommendations (Non-intrusive / User-First) */}
        <GlassCard strong className="relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive AI Intelligence
              </div>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Always in Control: Manual Choice or AI-Guided
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you prefer manual browsing, a quick 1-click mood check-in, or real-time
                facial emotion recommendations via your NeuroLearn webcam sensor, EmotionShift AI
                adapts to your pace without forcing anything.
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground/80">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>
                  Zero video storage. Camera stream is processed 100% locally on your device.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setMoodModalOpen(true)}
                className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                1-Click Mood Check
              </button>
              <Link to="/emotion-shift/scenarios" className="w-full sm:w-auto">
                <GradientButton className="w-full justify-center">
                  View Full Catalog <ArrowRight className="h-4 w-4 ml-1" />
                </GradientButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Mood Check-In Modal Dialog */}
      <MoodCheckIn open={moodModalOpen} onClose={() => setMoodModalOpen(false)} />
    </AppShell>
  );
}
