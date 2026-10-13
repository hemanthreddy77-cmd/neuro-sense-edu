import { Link } from "@tanstack/react-router";
import { Clock, BookOpen, Star } from "lucide-react";
import type { Course } from "@/data/mockData";
import { GlassCard } from "./GlassCard";
import { GradientButton } from "./GradientButton";

export function CourseCard({ course }: { course: Course }) {
  return (
    <GlassCard className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_oklch(0.68_0.18_255/0.5)]">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={
            course.thumbnail ||
            (course as { thumbnailUrl?: string }).thumbnailUrl ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
          }
          alt={course.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-violet/25 px-2.5 py-1 text-xs font-medium text-violet-glow backdrop-blur-md border border-violet/30">
            {course.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md border border-white/10">
            {course.difficulty}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-foreground line-clamp-1">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {course.durationHours}h
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {course.lessons} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-emotion-confused" /> {course.rating}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="text-foreground font-medium">{course.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-brand to-violet transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <Link to="/learn/$courseId" params={{ courseId: course.id }}>
            <GradientButton className="w-full">
              {course.progress > 0 ? "Continue" : "Start"} Learning
            </GradientButton>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
