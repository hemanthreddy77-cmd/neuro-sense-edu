import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, GraduationCap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { GlassCard } from "../common/GlassCard";
import { GradientButton } from "../common/GradientButton";
import { Logo } from "../common/Logo";
import { ParticleField } from "../landing/ParticleField";
import type { Role } from "@/contexts/AuthContext";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  icon: typeof Mail;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export function AuthShell({
  title,
  subtitle,
  fields,
  onSubmit,
  submitLabel,
  busy,
  error,
  footer,
  role,
  onRoleChange,
}: {
  title: string;
  subtitle: string;
  fields: Field[];
  onSubmit: () => void;
  submitLabel: string;
  busy?: boolean;
  error?: string | null;
  footer: ReactNode;
  role?: Role;
  onRoleChange?: (r: Role) => void;
}) {
  const [showPwIndex, setShowPwIndex] = useState<Record<number, boolean>>({});

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-background hero-grid-bg px-4 py-16">
      <ParticleField />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <GlassCard strong className="p-7 sm:p-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          {onRoleChange && (
            <div className="mt-5">
              <div className="text-xs font-medium text-foreground/80">Sign up as</div>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                {(["student", "admin"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={
                      "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition " +
                      (role === r
                        ? "bg-gradient-to-br from-brand to-violet text-background shadow"
                        : "text-foreground/70 hover:text-foreground")
                    }
                  >
                    {r === "student" ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {r === "student" ? "Student" : "Admin"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {fields.map((f, i) => {
              const isPw = f.type === "password";
              const showing = showPwIndex[i];
              return (
                <div key={f.name}>
                  <label className="text-xs font-medium text-foreground/70">{f.label}</label>
                  <div className="relative mt-1.5">
                    <f.icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={isPw && !showing ? "password" : isPw ? "text" : f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition"
                    />
                    {isPw && (
                      <button
                        type="button"
                        onClick={() => setShowPwIndex((s) => ({ ...s, [i]: !s[i] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-emotion-angry/30 bg-emotion-angry/10 px-3 py-2 text-xs text-emotion-angry">
              {error}
            </div>
          )}

          <div className="mt-5">
            <GradientButton onClick={onSubmit} className="w-full" disabled={busy}>
              {busy ? "Please wait…" : submitLabel}
            </GradientButton>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/10" />
            or continue with
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={onSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] hover:bg-white/95 transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </GlassCard>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 8 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.2A12 12 0 0 1 12.7 28L6.2 33A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C42 35.2 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export { type Field };
