import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { generateLessonFn } from "@/lib/ai/lesson.functions";
import type { GeneratedLesson } from "@/lib/ai/lesson.server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/lesson-studio")({
  head: () => ({
    meta: [
      { title: "AI Lesson Studio — NeuroLearn AI" },
      {
        name: "description",
        content: "Generate a personalized AI lesson with practice questions on any topic.",
      },
      { property: "og:title", content: "AI Lesson Studio — NeuroLearn AI" },
      {
        property: "og:description",
        content: "Personalized AI-powered lessons and practice quizzes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonStudio,
});

const PREFERENCES = [
  { id: "visual", label: "Visual", hint: "Diagrams & analogies" },
  { id: "hands-on", label: "Hands-on", hint: "Examples & exercises" },
  { id: "reading", label: "Reading", hint: "Structured prose" },
  { id: "auditory", label: "Conversational", hint: "Story-like" },
  { id: "concise", label: "Concise", hint: "Quick bullets" },
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function LessonStudio() {
  const [topic, setTopic] = useState("");
  const [preference, setPreference] = useState("visual");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const generate = async () => {
    if (topic.trim().length < 2 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateLessonFn({ data: { topic, preference, level } });
      if (res.ok) {
        setLesson(res.lesson);
        setAnswers({});
      } else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const answered = Object.keys(answers).length;
  const correct = lesson?.questions.filter((q, i) => answers[i] === q.answerIndex).length ?? 0;

  return (
    <AppShell title="AI Lesson Studio">
      <GlassCard strong className="p-6 sm:p-8 animate-fade-in-up">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI-powered</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Create your personalized lesson</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a topic and how you like to learn.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              maxLength={200}
              placeholder="e.g. Binary search trees, Photosynthesis, SQL joins"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/30 transition"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Learning preference</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PREFERENCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreference(p.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition hover:bg-white/10 active:scale-[0.98]",
                    preference === p.id ? "border-brand bg-brand/15" : "border-white/10 bg-white/5",
                  )}
                >
                  <div className="text-sm font-semibold text-foreground">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.hint}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Level</div>
            <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm transition hover:text-foreground active:scale-95",
                    level === l ? "bg-brand text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <GradientButton onClick={generate} disabled={loading || topic.trim().length < 2}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating lesson..." : "Generate lesson"}
          </GradientButton>
          {error && (
            <div className="rounded-xl border border-emotion-angry/30 bg-emotion-angry/10 px-4 py-3 text-sm text-emotion-angry">
              {error}
            </div>
          )}
        </div>
      </GlassCard>

      {lesson && (
        <div className="mt-6 space-y-6 animate-fade-in-up">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gradient">{lesson.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.summary}</p>
            <div className="mt-6 space-y-6">
              {lesson.sections.map((s, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-foreground">{s.heading}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                    {s.content}
                  </p>
                </div>
              ))}
            </div>
            {lesson.keyTakeaways.length > 0 && (
              <div className="mt-6 rounded-xl border border-brand/20 bg-brand/10 p-4">
                <div className="text-sm font-semibold text-foreground">Key takeaways</div>
                <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                  {lesson.keyTakeaways.map((k, i) => (
                    <li key={i}>• {k}</li>
                  ))}
                </ul>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-foreground">Practice questions</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Score: {correct}/{answered}
                </span>
                <button
                  onClick={() => setAnswers({})}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-foreground hover:bg-white/10 active:scale-95 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {lesson.questions.map((q, qi) => {
                const picked = answers[qi];
                const done = picked !== undefined;
                return (
                  <div key={qi} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-foreground">
                      {qi + 1}. {q.question}
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((o, oi) => {
                        const isCorrect = oi === q.answerIndex;
                        return (
                          <button
                            key={oi}
                            disabled={done}
                            onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition",
                              !done &&
                                "border-white/10 hover:bg-white/10 active:scale-[0.99] text-foreground/90",
                              done &&
                                isCorrect &&
                                "border-emotion-happy/50 bg-emotion-happy/15 text-foreground",
                              done &&
                                picked === oi &&
                                !isCorrect &&
                                "border-emotion-angry/50 bg-emotion-angry/15 text-foreground",
                              done &&
                                picked !== oi &&
                                !isCorrect &&
                                "border-white/5 text-muted-foreground",
                            )}
                          >
                            {done && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emotion-happy" />
                            )}
                            {done && picked === oi && !isCorrect && (
                              <XCircle className="h-4 w-4 shrink-0 text-emotion-angry" />
                            )}
                            {o}
                          </button>
                        );
                      })}
                    </div>
                    {done && <p className="mt-3 text-xs text-muted-foreground">{q.explanation}</p>}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}
    </AppShell>
  );
}
