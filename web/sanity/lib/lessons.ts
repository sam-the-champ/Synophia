import type { COURSE_FOR_LESSON_QUERY_RESULT } from "../../sanity.types";
import { sanityFetch } from "./fetch";
import { COURSE_FOR_LESSON_QUERY, LESSON_BY_SLUG_QUERY } from "./queries";

export type LessonCourseContext = {
  course: { title: string; slug: string };
  moduleTitle: string;
  moduleIndex: number;
  lessonIndex: number;
};

/**
 * A lesson doesn't store its parent course, so the module/lesson index used
 * for labels like "Lesson 5.1" is derived here via a reverse reference
 * lookup plus an in-code index search (GROQ can't cheaply return an array
 * match's index).
 */
export async function getLessonBySlug(slug: string) {
  const lesson = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
    tags: [`lesson:${slug}`],
  });

  if (!lesson) return null;

  const course = await sanityFetch({
    query: COURSE_FOR_LESSON_QUERY,
    params: { lessonId: lesson._id },
    tags: ["course"],
  });

  const context = course ? findLessonContext(course, lesson._id) : null;

  return { ...lesson, context };
}

function findLessonContext(
  course: NonNullable<COURSE_FOR_LESSON_QUERY_RESULT>,
  lessonId: string
): LessonCourseContext | null {
  const modules = course.modules ?? [];

  for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    const currentModule = modules[moduleIndex];
    const lessons = currentModule.lessons ?? [];
    const lessonIndex = lessons.findIndex((l) => l?._id === lessonId);

    if (lessonIndex !== -1 && course.title && course.slug && currentModule.title) {
      return {
        course: { title: course.title, slug: course.slug },
        moduleTitle: currentModule.title,
        moduleIndex: moduleIndex + 1,
        lessonIndex: lessonIndex + 1,
      };
    }
  }

  return null;
}
