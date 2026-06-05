import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { StatCard } from "@/components/common/StatCard";
import { SessionHistoryTable } from "@/components/common/SessionHistoryTable";
import { EMOTION_LOGS, EMOTION_DISTRIBUTION, EMOTIONS } from "@/data/mockData";
import { Activity, Focus, Smile, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — NeuroLearn AI" },
      { name: "description", content: "Your emotion trends, focus patterns and learning analytics." },
    ],
  }),
  component: AnalyticsPage,
});

const ranges = ["7 Days", "30 Days", "All Time"] as const;
type Range = typeof ranges[number];

const tooltipStyle = {
  backgroundColor: "oklch(0.21 0.035 270 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
};

function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30 Days");
  const data = range === "7 Days" ? EMOTION_LOGS.slice(-7) : EMOTION_LOGS;

  return (
    <AppShell title="Analytics">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Learning Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Patterns from your emotions, sessions and progress — all in one place.
          </p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={
                "rounded-full px-3 py-1.5 text-xs font-medium transition " +
                (range === r ? "bg-gradient-to-br from-brand to-violet text-background" : "text-foreground/70 hover:text-foreground")
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label="Total Sessions" value={data.reduce((s, d) => s + d.sessions, 0)} hint={range} />
        <StatCard icon={Focus} label="Avg Focus Time" value="34m" hint="per session" trend={{ value: "+12%", positive: true }} />
        <StatCard icon={Smile} label="Most Common Emotion" value={<span className="text-emotion-focused">Focused</span>} hint="38% of all sessions" />
        <StatCard icon={GraduationCap} label="Courses Completed" value={3} hint="2 in progress" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Emotion trend over time</div>
              <div className="text-xs text-muted-foreground">Daily readings · {range}</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="label" stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="focused"  stroke={EMOTIONS.focused.hex}  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="happy"    stroke={EMOTIONS.happy.hex}    strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="confused" stroke={EMOTIONS.confused.hex} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bored"    stroke={EMOTIONS.bored.hex}    strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="angry"    stroke={EMOTIONS.angry.hex}    strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">Emotion distribution</div>
            <div className="text-xs text-muted-foreground">Share of detected emotions</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EMOTION_DISTRIBUTION}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="oklch(0.16 0.03 270)"
                  strokeWidth={2}
                >
                  {EMOTION_DISTRIBUTION.map((e) => (
                    <Cell key={e.key} fill={EMOTIONS[e.key].hex} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6">
        <GlassCard className="p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">Sessions per day</div>
            <div className="text-xs text-muted-foreground">Past week</div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMOTION_LOGS.slice(-7)} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="label" stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.68 0.18 255 / 0.08)" }} />
                <Bar dataKey="sessions" fill="oklch(0.68 0.18 255)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Session history</h2>
        <SessionHistoryTable />
      </div>
    </AppShell>
  );
}
