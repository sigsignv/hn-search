import type { HackerNewsFilter } from "./types.js";

export function buildFilterQueryString(filters: HackerNewsFilter[]): string {
  return filters.map((filter) => filter.join("")).join(",");
}
