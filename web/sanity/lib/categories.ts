import { sanityFetch } from "./fetch";
import { CATEGORIES_QUERY } from "./queries";

export function getCategories() {
  return sanityFetch({
    query: CATEGORIES_QUERY,
    tags: ["category"],
  });
}
