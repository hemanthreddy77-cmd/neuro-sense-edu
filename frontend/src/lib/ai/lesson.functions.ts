import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const generateLessonFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      topic: z.string().trim().min(2).max(200),
      preference: z.string().min(1).max(40),
      level: z.string().min(1).max(40),
    }),
  )
  .handler(async ({ data }) => {
    const { generateLesson, LessonError } = await import("./lesson.server");
    try {
      return { ok: true as const, lesson: await generateLesson(data) };
    } catch (e) {
      const msg = e instanceof LessonError ? e.message : "Lesson generation failed.";
      return { ok: false as const, error: msg };
    }
  });
