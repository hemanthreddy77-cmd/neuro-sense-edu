import { useState, useMemo } from "react";
import { Search, Sparkles, Filter } from "lucide-react";
import { useCourses } from "@/contexts/CoursesContext";
import { CourseCard } from "../common/CourseCard";

export function CourseShowcase() {
  const { courses } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories from active courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filter courses by category and search keyword
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory =
        selectedCategory === "All" ||
        c.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <section id="courses" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Complete Course Library · {courses.length} Adaptive Tracks
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Explore all <span className="text-gradient">courses</span> across tech & AI
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every course dynamically senses your emotional focus, fatigue, and confusion to adapt its
              difficulty and pace in real-time.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search all courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer " +
                  (isActive
                    ? "bg-linear-to-r from-brand to-violet text-background font-semibold shadow-md shadow-brand/20"
                    : "border border-white/10 bg-white/5 text-foreground/75 hover:bg-white/10 hover:text-foreground")
                }
              >
                {cat}
                {cat === "All" && (
                  <span className="ml-1.5 opacity-80 text-[10px]">({courses.length})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-base font-medium text-foreground">No courses found matching your filter</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing your search query or picking "All".</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-foreground hover:bg-white/20 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
