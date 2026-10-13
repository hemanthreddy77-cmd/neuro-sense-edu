import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { COURSES, type Course, type Difficulty } from "@/data/mockData";
import { api } from "@/lib/api-client";

export type NewCourseInput = {
  title: string;
  category: string;
  description?: string;
  difficulty?: Difficulty;
  thumbnail?: string;
  durationHours?: number;
  lessons?: number;
};

type CoursesContextValue = {
  courses: Course[];
  isLoading: boolean;
  addCourse: (input: NewCourseInput) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  getCourse: (id: string) => Course | undefined;
  refreshCourses: () => Promise<void>;
  resetToDefaults: () => void;
};

const STORAGE_KEY = "neurolearn.courses.data";

const DEFAULT_THUMBNAILS = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
];

function normalizeCourse(raw: any): Course {
  return {
    id: String(raw.id || `c_${Date.now()}`),
    title: String(raw.title || "Untitled Course"),
    category: String(raw.category || "General"),
    description: String(raw.description || "Adaptive learning track with real-time biometric feedback."),
    thumbnail: String(raw.thumbnail || raw.thumbnailUrl || DEFAULT_THUMBNAILS[0]),
    progress: typeof raw.progress === "number" ? raw.progress : 0,
    difficulty: (raw.difficulty as Difficulty) || "Beginner",
    durationHours: typeof raw.durationHours === "number" ? raw.durationHours : 10,
    lessons: typeof raw.lessons === "number" ? raw.lessons : 16,
    rating: typeof raw.rating === "number" ? raw.rating : 4.9,
  };
}

function loadInitialCourses(): Course[] {
  if (typeof window === "undefined") return COURSES;
  try {
    const map = new Map<string, Course>();
    // Always load the full baseline course catalog
    COURSES.forEach((c) => map.set(c.id, c));

    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.map(normalizeCourse).forEach((c) => {
          map.set(c.id, c);
        });
      }
    }
    return Array.from(map.values());
  } catch {
    // ignore parse error and fallback
  }
  return COURSES;
}

const CoursesContext = createContext<CoursesContextValue | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(loadInitialCourses);
  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage whenever courses change
  const persist = useCallback((list: Course[]) => {
    setCourses(list);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
  }, []);

  const refreshCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.courses.getAll();
      if (res?.success && Array.isArray(res.courses) && res.courses.length > 0) {
        const fetchedNormalized = res.courses.map(normalizeCourse);
        
        // Merge with locally added courses so nothing is lost
        setCourses((current) => {
          const courseMap = new Map<string, Course>();
          // 1. Seed defaults
          COURSES.forEach((c) => courseMap.set(c.id, c));
          // 2. Add current local state
          current.forEach((c) => courseMap.set(c.id, c));
          // 3. Overlay backend courses
          fetchedNormalized.forEach((c) => courseMap.set(c.id, c));
          
          const merged = Array.from(courseMap.values());
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            }
          } catch {}
          return merged;
        });
      }
    } catch {
      // Backend may be offline in standalone mode; keep local courses
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from backend on initial mount
  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  const addCourse = useCallback(
    async (input: NewCourseInput): Promise<Course> => {
      const newId = `c_${Date.now()}`;
      const newCourse: Course = {
        id: newId,
        title: input.title.trim(),
        category: input.category.trim() || "Technology",
        description:
          input.description?.trim() ||
          "Adaptive neuroscience-backed learning path designed for optimal focus and knowledge retention.",
        thumbnail:
          input.thumbnail?.trim() ||
          DEFAULT_THUMBNAILS[Math.floor(Math.random() * DEFAULT_THUMBNAILS.length)],
        progress: 0,
        difficulty: input.difficulty || "Beginner",
        durationHours: input.durationHours ? Number(input.durationHours) : 12,
        lessons: input.lessons ? Number(input.lessons) : 18,
        rating: 5.0,
      };

      // 1. Immediately update local state & localStorage so the UI updates with zero delay
      setCourses((prev) => {
        const updated = [newCourse, ...prev];
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });

      // 2. Send to backend if available
      try {
        await api.courses.create({
          id: newCourse.id,
          title: newCourse.title,
          category: newCourse.category,
          description: newCourse.description,
          thumbnailUrl: newCourse.thumbnail,
          difficulty: newCourse.difficulty,
          lessons: newCourse.lessons,
          durationHours: newCourse.durationHours,
        });
      } catch (err) {
        console.warn("Backend course sync not available, saved to local cache:", err);
      }

      return newCourse;
    },
    [],
  );

  const deleteCourse = useCallback(async (id: string) => {
    setCourses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });

    try {
      await api.courses.delete(id);
    } catch {
      // ignore backend error if offline
    }
  }, []);

  const getCourse = useCallback(
    (id: string): Course | undefined => {
      return courses.find((c) => c.id === id) || COURSES.find((c) => c.id === id);
    },
    [courses],
  );

  const resetToDefaults = useCallback(() => {
    persist(COURSES);
  }, [persist]);

  const value = useMemo<CoursesContextValue>(
    () => ({
      courses,
      isLoading,
      addCourse,
      deleteCourse,
      getCourse,
      refreshCourses,
      resetToDefaults,
    }),
    [courses, isLoading, addCourse, deleteCourse, getCourse, refreshCourses, resetToDefaults],
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return ctx;
}
