import { sanityFetch } from "./fetch";
import { COURSE_BY_SLUG_QUERY, COURSES_QUERY } from "./queries";

export function getCourses() {
  return sanityFetch({
    query: COURSES_QUERY,
    tags: ["course", "instructor", "category"],
  });
}

export function getCourseBySlug(slug: string) {
  return sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`course:${slug}`, "instructor", "category", "lesson"],
  });
}
