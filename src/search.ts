import { hnSearch } from "./index.js";
import type { HackerNewsSearchOptions } from "./types.js";

/**
 * @deprecated Use `hnSearch` instead.
 */
export async function searchByDate(options: HackerNewsSearchOptions) {
  return hnSearch({ sort: "date", ...options });
}

/**
 * @deprecated Use `hnSearch` instead.
 */
export async function searchByRelevance(options: HackerNewsSearchOptions) {
  return hnSearch({ sort: "relevance", ...options });
}
