import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import type { Scenario } from "@/data/emotionShiftData";
import { SCENARIO_CATEGORIES } from "@/data/emotionShiftData";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";

// Import all experience modules
import { BreathingExperience } from "./experiences/BreathingExperience";
import { GroundingExperience } from "./experiences/GroundingExperience";
import { MemoryGame } from "./experiences/MemoryGame";
import { TriviaChallenge } from "./experiences/TriviaChallenge";
import { MotivationChallenge } from "./experiences/MotivationChallenge";
import { FocusTimer } from "./experiences/FocusTimer";
import { CreativeCanvas } from "./experiences/CreativeCanvas";
import { ReflectionExperience } from "./experiences/ReflectionExperience";
import { KnowledgeExplorer } from "./experiences/KnowledgeExplorer";

interface ScenarioPlayerProps {
  scenario: Scenario;
}

export function ScenarioPlayer({ scenario }: ScenarioPlayerProps) {
  const [completed, setCompleted] = useState(false);
  const category = SCENARIO_CATEGORIES.find((c) => c.slug === scenario.categorySlug);

  const handleComplete = () => {
    setCompleted(true);
    // Record in local history
    try {
      const history = JSON.parse(localStorage.getItem("neuro_emotionshift_history") || "[]");
      history.unshift({
        id: Date.now(),
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        categorySlug: scenario.categorySlug,
        timestamp: new Date().toISOString(),
        durationLabel: scenario.durationLabel,
      });
      localStorage.setItem("neuro_emotionshift_history", JSON.stringify(history.slice(0, 50)));
    } catch {
      // LocalStorage error fallback
    }

    // Try posting to backend if reachable
    try {
      fetch("/api/emotionshift/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          categorySlug: scenario.categorySlug,
          completedAt: new Date().toISOString(),
        }),
      }).catch(() => {
        // Backend optional/offline
      });
    } catch {
      // Ignore network errors in offline mode
    }
  };

  const renderExperience = () => {
    switch (scenario.component) {
      case "BreathingExperience":
        return <BreathingExperience onComplete={handleComplete} />;
      case "GroundingExperience":
        return <GroundingExperience onComplete={handleComplete} />;
      case "MemoryGame":
        return <MemoryGame onComplete={handleComplete} />;
      case "TriviaChallenge":
        return <TriviaChallenge onComplete={handleComplete} />;
      case "MotivationChallenge":
        return <MotivationChallenge onComplete={handleComplete} />;
      case "FocusTimer":
        return <FocusTimer onComplete={handleComplete} />;
      case "CreativeCanvas":
        return <CreativeCanvas onComplete={handleComplete} />;
      case "ReflectionExperience":
        return <ReflectionExperience onComplete={handleComplete} />;
      case "KnowledgeExplorer":
        return <KnowledgeExplorer onComplete={handleComplete} />;
      default:
        return <BreathingExperience onComplete={handleComplete} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top navigation & info bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/emotion-shift/scenarios"
          search={{ category: scenario.categorySlug }}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to {category?.title || "Scenarios"}
        </Link>

        <div className="flex items-center gap-3">
          {category && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: `color-mix(in oklab, ${category.accentColor} 15%, transparent)`,
                color: category.accentColor,
              }}
            >
              <category.icon className="h-3.5 w-3.5" />
              {category.title}
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {scenario.durationLabel}
          </span>
        </div>
      </div>

      {/* Main Experience Shell Card */}
      <GlassCard strong className="p-6 sm:p-8 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: category?.accentColor || "var(--color-brand)" }}
        />

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{scenario.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              {scenario.description}
            </p>
          </div>

          {/* Render selected experience */}
          <div className="w-full mt-4">{renderExperience()}</div>
        </div>
      </GlassCard>

      {/* Completion Dialog / Banner */}
      {completed && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Experience Recorded</h4>
              <p className="text-xs text-muted-foreground">
                Your activity has been logged. How do you feel now?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/emotion-shift">
              <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                Browse More
              </button>
            </Link>
            <Link to="/dashboard">
              <GradientButton className="text-xs px-4 py-2">Back to Dashboard</GradientButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
