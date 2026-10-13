import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ScenarioPlayer } from "@/components/emotion-shift/ScenarioPlayer";
import { getScenarioById } from "@/data/emotionShiftData";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

export const Route = createFileRoute("/_authenticated/emotion-shift/play/$scenarioId")({
  head: () => ({
    meta: [
      { title: "Play Experience — EmotionShift AI" },
      {
        name: "description",
        content: "Interactive emotion-adaptive experience player.",
      },
    ],
  }),
  component: ScenarioPlayPage,
});

function ScenarioPlayPage() {
  const { scenarioId } = Route.useParams();
  const scenario = getScenarioById(scenarioId);

  if (!scenario) {
    return (
      <AppShell title="Scenario Not Found">
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-400 mb-4" />
          <h2 className="text-xl font-bold text-foreground">Experience Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The scenario you requested doesn't exist or is not currently available.
          </p>
          <Link to="/emotion-shift/scenarios" className="mt-6">
            <GradientButton>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Scenarios
            </GradientButton>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={scenario.title}>
      <ScenarioPlayer scenario={scenario} />
    </AppShell>
  );
}
