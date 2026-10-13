import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { EMOTION_LOGS } from "@/data/mockData";
import { GlassCard } from "../common/GlassCard";
import { AnimatedCounter } from "../common/AnimatedCounter";
import { TrendingUp, Target, GraduationCap, Activity } from "lucide-react";

const last14 = EMOTION_LOGS.slice(-14);

const tooltipStyle = {
  backgroundColor: "oklch(0.21 0.035 270 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
};

export function LiveAnalyticsPreview() {
  return (
    <section id="analytics" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live <span className="text-gradient">analytics</span>, real outcomes
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Every session becomes signal. Watch emotion and focus trends translate into measurable
            learning gains.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <GlassCard className="p-5 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Focus trend · last 14 days
                </div>
                <div className="text-xs text-muted-foreground">Daily average focus score</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emotion-happy/15 px-2.5 py-1 text-xs font-medium text-emotion-happy border border-emotion-happy/30">
                <TrendingUp className="h-3 w-3" /> +18.4%
              </span>
            </div>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last14} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.18 255)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="oklch(0.68 0.18 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                  <XAxis dataKey="label" stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ stroke: "oklch(0.68 0.18 255)", strokeOpacity: 0.4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="focused"
                    stroke="oklch(0.78 0.16 250)"
                    strokeWidth={2.5}
                    fill="url(#focusFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">Sessions per day</div>
                <div className="text-xs text-muted-foreground">Past week</div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" /> Daily
              </span>
            </div>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={last14.slice(-7)}
                  margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                  <XAxis dataKey="label" stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="oklch(0.7 0.025 260)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "oklch(0.68 0.18 255 / 0.08)" }}
                  />
                  <Bar dataKey="sessions" fill="oklch(0.62 0.14 305)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* counters */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Target, value: 95, suffix: "%", label: "Student satisfaction" },
            { icon: Activity, value: 87, suffix: "%", label: "Increased focus" },
            { icon: GraduationCap, value: 92, suffix: "%", label: "Course completion" },
            { icon: TrendingUp, value: 10000, suffix: "+", label: "Learning sessions" },
          ].map((s) => (
            <GlassCard key={s.label} className="p-5 text-center">
              <s.icon className="mx-auto h-5 w-5 text-brand-glow" />
              <div className="mt-2 text-3xl font-bold text-gradient">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
