import { sanityFetch } from "./fetch";
import { INSTRUCTOR_BY_SLUG_QUERY } from "./queries";

export function getInstructorBySlug(slug: string) {
  return sanityFetch({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
    tags: [`instructor:${slug}`, "course"],
  });
}
