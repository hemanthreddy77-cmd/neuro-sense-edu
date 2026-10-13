import {
  ScanFace,
  SlidersHorizontal,
  Sparkles,
  LineChart,
  Lightbulb,
  BrainCog,
  Cloud,
  Lock,
  Zap,
  Cpu,
  Database,
} from "lucide-react";
import { GlassCard } from "../common/GlassCard";

const features = [
  {
    icon: ScanFace,
    title: "Emotion Recognition",
    body: "Detects learner emotions using advanced facial analysis.",
  },
  {
    icon: SlidersHorizontal,
    title: "Adaptive Learning",
    body: "Automatically adjusts content difficulty and presentation style.",
  },
  {
    icon: Sparkles,
    title: "Personalized Experience",
    body: "Every learner receives a unique learning journey.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    body: "Track emotions, focus levels, and learning performance.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    body: "Provides better content based on learner behavior.",
  },
  {
    icon: BrainCog,
    title: "Progress Intelligence",
    body: "Uses emotional insights to improve retention and completion rates.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-md">
            <BrainCog className="h-3.5 w-3.5 text-violet" />
            Built for the next generation of learning
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Why <span className="text-gradient">NeuroLearn AI?</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Six adaptive pillars that turn passive video lessons into a living, responsive tutoring
            experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <GlassCard
              key={f.title}
              className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-violet/20 text-brand-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: BrainCog, label: "AI Learning" },
    { icon: LineChart, label: "Real-Time Analytics" },
    { icon: Cpu, label: "Adaptive Education" },
    { icon: Lock, label: "Secure Authentication" },
    { icon: Cloud, label: "Cloud Infrastructure" },
    { icon: Database, label: "Privacy-First Data" },
    { icon: Zap, label: "Edge Intelligence" },
  ];
  return (
    <section className="relative border-y border-white/10 bg-surface/30 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted technology stack
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((i) => (
            <div
              key={i.label}
              className="inline-flex items-center gap-2 text-sm text-foreground/75 hover:text-foreground transition"
            >
              <i.icon className="h-4 w-4 text-brand" />
              {i.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
