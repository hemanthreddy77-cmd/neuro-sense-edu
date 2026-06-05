import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { CourseCard } from "@/components/common/CourseCard";
import { GlassCard } from "@/components/common/GlassCard";
import { EmotionBadge } from "@/components/common/EmotionBadge";
import { GradientButton } from "@/components/common/GradientButton";
import { BookOpen, Clock, Smile, Flame, ArrowRight } from "lucide-react";
import { COURSES, RECENT_ACTIVITY, EMOTIONS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NeuroLearn AI" },
      { name: "description", content: "Your personalized adaptive learning dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const currentEmotion = useMemo(() => "focused" as const, []);
  const meta = EMOTIONS[currentEmotion];

  return (
    <AppShell title="Dashboard">
      {/* Welcome banner */}
      <GlassCard strong className="relative overflow-hidden p-6 sm:p-8 animate-fade-in-up">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-violet/25 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
              Hello, <span className="text-gradient">{user?.name || "Learner"}!</span> Ready to learn today?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your focus level is high — a perfect window for a deep-work session.
            </p>
          </div>
          <Link to="/learn/$courseId" params={{ courseId: "c1" }}>
            <GradientButton>
              Continue Learning <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </Link>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses Enrolled" value={COURSES.length} hint="2 in progress" />
        <StatCard icon={Clock} label="Hours Learned" value="42.5h" hint="+5.2h this week" trend={{ value: "+12% vs last week", positive: true }} />
        <StatCard
          icon={Smile}
          label="Current Emotion"
          value={
            <span style={{ color: meta.hex }} className="inline-flex items-center gap-1.5">
              {meta.emoji} {meta.label}
            </span>
          }
          hint="Detected just now"
        />
        <StatCard icon={Flame} label="Streak" value="12 days" hint="Personal best: 21 days" />
      </div>

      {/* Courses + activity */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
            <a href="#" className="text-xs font-semibold text-brand hover:text-brand-glow">View all →</a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {COURSES.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent Activity</h2>
          <GlassCard className="p-2">
            <ul className="divide-y divide-white/5">
              {RECENT_ACTIVITY.map((a) => (
                <li key={a.id} className="flex items-start gap-3 p-3">
                  <EmotionBadge emotion={a.emotion} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{a.course}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.timestamp} · {a.durationMin}m
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
