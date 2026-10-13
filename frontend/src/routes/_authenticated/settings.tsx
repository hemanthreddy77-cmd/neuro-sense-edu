import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Lock, Sun, Moon, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NeuroLearn AI" },
      { name: "description", content: "Manage your profile, preferences and privacy." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [prefs, setPrefs] = useState({
    webcam: true,
    emailNotif: true,
    productNotif: false,
    weeklyReport: true,
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  return (
    <AppShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <p className="text-xs text-muted-foreground">
            Manage how you appear across NeuroLearn AI.
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-violet text-xl font-bold text-background">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              <button className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-background text-foreground/80 hover:text-foreground">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground">PNG or JPG, up to 2MB.</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} />
          </div>

          <div className="mt-6">
            <GradientButton onClick={() => updateProfile({ name, email })}>
              Save changes
            </GradientButton>
          </div>
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="text-xs text-muted-foreground">Tune your learning experience.</p>

          <div className="mt-5 space-y-3">
            <Toggle
              label="Webcam permission"
              description="Required for adaptive emotion detection"
              checked={prefs.webcam}
              onChange={(v) => setPrefs({ ...prefs, webcam: v })}
            />
            <Toggle
              label="Email notifications"
              description="Important updates and reminders"
              checked={prefs.emailNotif}
              onChange={(v) => setPrefs({ ...prefs, emailNotif: v })}
            />
            <Toggle
              label="Product updates"
              description="New features and tips"
              checked={prefs.productNotif}
              onChange={(v) => setPrefs({ ...prefs, productNotif: v })}
            />
            <Toggle
              label="Weekly report"
              description="A summary of your focus & emotions"
              checked={prefs.weeklyReport}
              onChange={(v) => setPrefs({ ...prefs, weeklyReport: v })}
            />
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-foreground">Theme</div>
            <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setTheme("dark")}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium " +
                  (theme === "dark"
                    ? "bg-gradient-to-br from-brand to-violet text-background"
                    : "text-foreground/70")
                }
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium " +
                  (theme === "light"
                    ? "bg-gradient-to-br from-brand to-violet text-background"
                    : "text-foreground/70")
                }
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Password */}
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">Change password</h2>
          <p className="text-xs text-muted-foreground">
            Use a strong password you don't reuse elsewhere.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field
              label="Current password"
              value={pw.current}
              onChange={(v) => setPw({ ...pw, current: v })}
              type="password"
              icon={Lock}
            />
            <Field
              label="New password"
              value={pw.next}
              onChange={(v) => setPw({ ...pw, next: v })}
              type="password"
              icon={Lock}
            />
            <Field
              label="Confirm new"
              value={pw.confirm}
              onChange={(v) => setPw({ ...pw, confirm: v })}
              type="password"
              icon={Lock}
            />
          </div>
          <div className="mt-5">
            <GradientButton>Update password</GradientButton>
          </div>
        </GlassCard>

        {/* Danger zone */}
        <GlassCard className="p-6 border border-emotion-angry/30">
          <h2 className="text-lg font-semibold text-emotion-angry">Danger zone</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              logout();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-emotion-angry/40 bg-emotion-angry/15 px-4 py-2 text-sm font-semibold text-emotion-angry hover:bg-emotion-angry/25 transition"
          >
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: any;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground/70">{label}</label>
      <div className="relative mt-1.5">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-3 text-sm text-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition " +
            (Icon ? "pl-10" : "pl-3")
          }
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={
          "relative h-6 w-11 shrink-0 rounded-full transition " +
          (checked ? "bg-gradient-to-r from-brand to-violet" : "bg-white/15")
        }
        aria-pressed={checked}
      >
        <span
          className={
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition " +
            (checked ? "left-[22px]" : "left-0.5")
          }
        />
      </button>
    </div>
  );
}
