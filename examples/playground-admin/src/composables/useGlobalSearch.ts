import { ref } from "vue";

/** What the search of the top bar can look for, as in the Administration. */
export const searchTypes = [
  "all",
  "products",
  "categories",
  "customers",
  "orders",
  "manufacturers",
  "properties",
  "reviews",
  "promotions",
  "newsletter",
  "productStreams",
  "rules",
  "flows",
  "cms",
] as const;

export type SearchType = (typeof searchTypes)[number];

const term = ref("");
const type = ref<SearchType>("all");

/**
 * The term and the type of the top bar's search. A list page filters its rows by the term while
 * the type is its own, like the Administration's search bar does on module pages.
 */
export function useGlobalSearch() {
  return { term, type };
}
