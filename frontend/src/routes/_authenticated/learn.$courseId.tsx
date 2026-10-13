import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, X, Clock, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { WebcamPanel } from "@/components/common/WebcamPanel";
import { AdaptiveBanner } from "@/components/common/AdaptiveBanner";
import { type EmotionKey } from "@/data/mockData";
import { useCourses } from "@/contexts/CoursesContext";

export const Route = createFileRoute("/_authenticated/learn/$courseId")({
  head: ({ params }) => ({
    meta: [
      { title: "Learning Session — NeuroLearn AI" },
      { name: "description", content: `Adaptive learning session for course ${params.courseId}.` },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const { getCourse, courses } = useCourses();
  const course = getCourse(courseId) ?? courses[0];
  const [emotion, setEmotion] = useState<EmotionKey>("focused");
  const [lessonIdx, setLessonIdx] = useState(3);
  const [playing, setPlaying] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AppShell title="Learning Session">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80">
            <Clock className="h-3.5 w-3.5" /> {mm}:{ss}
          </span>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-emotion-angry/30 bg-emotion-angry/10 px-3 py-1.5 text-xs font-semibold text-emotion-angry hover:bg-emotion-angry/20 transition"
          >
            <X className="h-3.5 w-3.5" /> End session
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.85fr_1fr]">
        {/* Content area (65%) */}
        <div className="space-y-4">
          <GlassCard className="overflow-hidden p-0">
            <div className="relative aspect-video w-full bg-black">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setPlaying((v) => !v)}
                className="absolute inset-0 grid place-items-center"
                aria-label={playing ? "Pause" : "Play"}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-background shadow-2xl transition hover:scale-105">
                  {playing ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 translate-x-0.5" />
                  )}
                </span>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-2/5 rounded-full bg-linear-to-r from-brand to-violet" />
                  </div>
                  <span className="text-xs text-white/80">07:42 / 18:30</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {course.title} · Lesson {lessonIdx + 1} of {course.lessons}
              </div>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                Neural Networks: From Perceptrons to Modern Architectures
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Explore how a simple weighted sum becomes a powerful approximator. We'll walk
                through the perceptron, then build up to multilayer networks, gradient descent, and
                the activation functions that make modern deep learning work. Lessons adapt as your
                engagement and focus change.
              </p>

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setLessonIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <GradientButton onClick={() => setLessonIdx((i) => i + 1)}>
                  Next Lesson <ChevronRight className="h-4 w-4" />
                </GradientButton>
              </div>
            </div>
          </GlassCard>

          {/* Adaptive banner */}
          <AdaptiveBanner emotion={emotion} />

          {/* Lesson notes */}
          <GlassCard className="p-5">
            <div className="text-sm font-semibold text-foreground">Smart notes</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                • A perceptron computes{" "}
                <code className="rounded bg-white/5 px-1 py-0.5 text-brand">y = step(w·x + b)</code>
              </li>
              <li>• Activation functions (ReLU, sigmoid, tanh) introduce non-linearity</li>
              <li>• Gradient descent minimizes loss by walking against the gradient</li>
              <li>• Modern networks stack many layers — depth enables abstraction</li>
            </ul>
          </GlassCard>
        </div>

        {/* Webcam + emotion (35%) */}
        <div>
          <WebcamPanel onEmotionChange={(e) => setEmotion(e)} />
        </div>
      </div>
    </AppShell>
  );
}
