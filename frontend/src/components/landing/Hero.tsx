import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Camera,
  Brain,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { GradientButton } from "../common/GradientButton";
import { GlassCard } from "../common/GlassCard";
import { ParticleField } from "./ParticleField";
import { FLOATING_EMOTIONS, EMOTIONS } from "@/data/mockData";

export function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden pt-28">
      <ParticleField />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 lg:grid-cols-2 lg:pt-12">
        {/* Left: copy */}
        <div className="relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            AI-Powered Adaptive Education
          </div>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Learning That </span>
            <span className="text-gradient animate-gradient">Understands You</span>
          </h1>
          <p className="mt-4 text-xl text-foreground/85">
            Powered by Real-Time Emotion Intelligence
          </p>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            NeuroLearn AI transforms online education by analyzing learner emotions in real time and
            adapting lessons dynamically to improve engagement, focus, and learning outcomes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register">
              <GradientButton>
                Start Learning Free
                <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </Link>
            <a href="#features">
              <GradientButton variant="outline">
                <PlayCircle className="h-4 w-4" />
                Explore Platform
              </GradientButton>
            </a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i + 10}`}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-background"
                />
              ))}
            </div>
            <span>
              <span className="text-foreground font-semibold">10,000+ learners</span> already
              adapting their study flow
            </span>
          </div>
        </div>

        {/* Right: dashboard mockup */}
        <div className="relative z-10">
          <DashboardMockup />
          <FloatingEmotionCards />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-brand/30 via-violet/20 to-transparent blur-3xl" />
      <GlassCard strong className="p-4 sm:p-5">
        {/* fake window chrome */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emotion-angry/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emotion-confused/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emotion-happy/70" />
          </div>
          <div className="text-[10px] text-muted-foreground">neurolearn.ai · live session</div>
          <div className="h-2 w-2" />
        </div>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {/* webcam tile */}
          <div className="col-span-2 overflow-hidden rounded-xl border border-white/10 bg-black/60 aspect-[3/4] relative">
            <img
              src="https://i.pravatar.cc/300?img=47"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-md border border-white/10">
              <span className="h-1 w-1 rounded-full bg-emotion-happy animate-pulse" />
              LIVE
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="rounded-lg bg-white/5 px-2 py-1.5 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Camera className="h-3 w-3 text-brand" />
                  <span className="text-foreground/70">Focus</span>
                  <span className="ml-auto font-semibold text-emotion-happy">92%</span>
                </div>
              </div>
            </div>
          </div>

          {/* main panel */}
          <div className="col-span-3 space-y-2.5">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Now playing
              </div>
              <div className="mt-0.5 text-sm font-semibold text-foreground">
                Neural Networks · Lesson 4
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand to-violet" />
              </div>
            </div>

            {/* mini chart */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Focus trend
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emotion-happy">
                  <TrendingUp className="h-3 w-3" /> +18%
                </span>
              </div>
              <svg viewBox="0 0 120 36" className="mt-2 h-10 w-full">
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.18 255)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="oklch(0.68 0.18 255)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,28 L12,22 L24,26 L36,16 L48,20 L60,10 L72,14 L84,6 L96,12 L108,4 L120,8 L120,36 L0,36 Z"
                  fill="url(#spark)"
                />
                <path
                  d="M0,28 L12,22 L24,26 L36,16 L48,20 L60,10 L72,14 L84,6 L96,12 L108,4 L120,8"
                  fill="none"
                  stroke="oklch(0.78 0.16 250)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* recs */}
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-violet/15 to-brand/10 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-violet-glow">
                <Brain className="h-3 w-3" /> Adaptive recommendation
              </div>
              <div className="mt-1 text-xs text-foreground">
                Switching to a visual walkthrough — your focus dipped slightly.
              </div>
            </div>
          </div>
        </div>

        {/* mini stats */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: BookOpen, label: "Lessons", value: "28" },
            { icon: TrendingUp, label: "Streak", value: "12d" },
            { icon: Brain, label: "Focus", value: "87%" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <s.icon className="h-3 w-3" />
                {s.label}
              </div>
              <div className="text-sm font-semibold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function FloatingEmotionCards() {
  const positions = [
    "top-2 -left-4 sm:-left-10",
    "top-1/3 -right-2 sm:-right-8",
    "bottom-10 -left-2 sm:-left-8",
    "-top-3 right-1/4",
    "bottom-2 right-1/4",
  ];
  return (
    <>
      {FLOATING_EMOTIONS.map((e, i) => {
        const meta = EMOTIONS[e.key];
        return (
          <div
            key={e.key}
            className={`absolute ${positions[i]} hidden sm:block animate-float`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <div
              className="glass-strong flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                borderColor: `color-mix(in oklab, ${meta.hex} 40%, transparent)`,
                color: meta.hex,
              }}
            >
              <span aria-hidden>{e.emoji}</span>
              {e.label}
            </div>
          </div>
        );
      })}
    </>
  );
}
