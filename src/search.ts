import { hnSearch } from "./index.js";
import type { HackerNewsSearchOptions } from "./types.js";

export async function searchByDate(options: HackerNewsSearchOptions) {
  return hnSearch({ sort: "date", ...options });
}

export async function searchByRelevance(options: HackerNewsSearchOptions) {
  return hnSearch({ sort: "relevance", ...options });
}
