import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Activity,
  HardDrive,
  Plus,
  Trash2,
  Eye,
  Edit3,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { ADMIN_USERS, COURSES, SYSTEM_HEALTH } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — NeuroLearn AI" },
      { name: "description", content: "Administer users, courses and platform health." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slideOpen, setSlideOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", category: "", difficulty: "Beginner" });

  useEffect(() => {
    if (user && user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (user?.role !== "admin") {
    return (
      <AppShell title="Admin">
        <GlassCard className="p-10 text-center">
          <div className="text-lg font-semibold text-foreground">Admin access required</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with an email containing "admin" to preview the admin panel.
          </p>
        </GlassCard>
      </AppShell>
    );
  }

  return (
    <AppShell title="Admin Panel">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}    label="Total Users"          value={1248} hint="+38 this week" trend={{ value: "+3.1%", positive: true }} />
        <StatCard icon={BookOpen} label="Total Courses"        value={COURSES.length} hint="6 categories" />
        <StatCard icon={Activity} label="Active Sessions Today" value={142} hint="Peak: 219" />
        <StatCard icon={HardDrive} label="System Status"        value={<span className="text-emotion-happy">All systems go</span>} hint="Last incident: 32d ago" />
      </div>

      {/* System health */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SYSTEM_HEALTH.map((h) => (
          <GlassCard key={h.id} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-foreground">{h.label}</div>
              <div className="text-xs text-muted-foreground">Latency {h.latency}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emotion-happy/15 px-2.5 py-1 text-xs font-medium text-emotion-happy border border-emotion-happy/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emotion-happy animate-pulse" />
              Operational
            </span>
          </GlassCard>
        ))}
      </div>

      {/* Users */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Users</h2>
        </div>
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Last Active</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ADMIN_USERS.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition">
                    <td className="px-5 py-3 text-foreground/95">{u.name}</td>
                    <td className="px-5 py-3 text-foreground/70">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-violet/15 px-2 py-0.5 text-xs font-medium text-violet-glow border border-violet/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground/70">{u.lastActive}</td>
                    <td className="px-5 py-3">
                      <span className={
                        "rounded-full px-2.5 py-0.5 text-xs font-medium border " +
                        (u.status === "Active"
                          ? "bg-emotion-happy/15 text-emotion-happy border-emotion-happy/30"
                          : "bg-white/5 text-muted-foreground border-white/10")
                      }>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 hover:text-brand hover:bg-white/5"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 hover:text-emotion-angry hover:bg-white/5"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Courses */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Courses Management</h2>
          <GradientButton onClick={() => setSlideOpen(true)}>
            <Plus className="h-4 w-4" /> Add Course
          </GradientButton>
        </div>
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Course Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Difficulty</th>
                  <th className="px-5 py-3 font-medium">Students</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map((c, i) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition">
                    <td className="px-5 py-3 text-foreground/95">{c.title}</td>
                    <td className="px-5 py-3 text-foreground/70">{c.category}</td>
                    <td className="px-5 py-3 text-foreground/70">{c.difficulty}</td>
                    <td className="px-5 py-3 text-foreground/70">{120 + i * 47}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 hover:text-brand hover:bg-white/5"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 hover:text-emotion-angry hover:bg-white/5"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Slide-over */}
      {slideOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSlideOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md animate-fade-in-up">
            <div className="glass-strong flex h-full flex-col rounded-l-2xl border-l border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-foreground">Add new course</div>
                  <div className="text-xs text-muted-foreground">Create an adaptive course in seconds.</div>
                </div>
                <button onClick={() => setSlideOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Course Title", key: "title", placeholder: "Intro to LLMs" },
                  { label: "Category",     key: "category", placeholder: "Artificial Intelligence" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-foreground/70">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={(newCourse as any)[f.key]}
                      onChange={(e) => setNewCourse((c) => ({ ...c, [f.key]: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-foreground/70">Difficulty</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {["Beginner", "Intermediate", "Advanced"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setNewCourse((c) => ({ ...c, difficulty: d }))}
                        className={
                          "rounded-lg border px-3 py-2 text-xs font-medium transition " +
                          (newCourse.difficulty === d
                            ? "border-brand/50 bg-brand/15 text-brand"
                            : "border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10")
                        }
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <GradientButton className="w-full" onClick={() => setSlideOpen(false)}>
                  Create course
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
