import { Camera, Brain, Wand2, BarChart3, Trophy } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Connect and Start Learning",
    body: "Enable your webcam and pick a course. We respect your privacy — frames never leave your session.",
  },
  {
    icon: Brain,
    title: "AI Detects Learning Emotions",
    body: "Our model interprets engagement, focus, confusion, boredom and more — in real time.",
  },
  {
    icon: Wand2,
    title: "Content Adapts Automatically",
    body: "Lessons reshape: simpler explanations when stuck, deeper context when curious.",
  },
  {
    icon: BarChart3,
    title: "Track Performance Analytics",
    body: "See exactly when you learn best — and which content patterns work for you.",
  },
  {
    icon: Trophy,
    title: "Achieve Better Learning Outcomes",
    body: "Move faster with confidence, finish more courses, retain more knowledge.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How <span className="text-gradient">It Works</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Five steps from passive video watching to a fully adaptive learning loop.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="glass-card h-full rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-violet text-sm font-bold text-background">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-brand-glow" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 -right-2 hidden h-px w-4 bg-gradient-to-r from-brand to-transparent lg:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
