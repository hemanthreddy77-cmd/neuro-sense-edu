import { COURSES } from "@/data/mockData";
import { CourseCard } from "../common/CourseCard";

export function CourseShowcase() {
  return (
    <section id="courses" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Adaptive <span className="text-gradient">courses</span> across modern tech
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Six handpicked tracks that demonstrate how emotion-aware learning works across
              very different subjects.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-glow transition"
          >
            View all courses →
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
