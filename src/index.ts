import { type SearchOptions, searchByDate, searchByRelevance } from "./search.js";
import type { HackerNewsFilter, HackerNewsSearchResult, HackerNewsTag } from "./types.js";

export * from "./search.js";

export type {
  HackerNewsSearchResult,
  HackerNewsStory,
  HackerNewsComment,
  HackerNewsPoll,
  HackerNewsPollOption,
  HackerNewsJob,
  HackerNewsTag,
  HackerNewsFilter,
} from "./types.js";

export type HackerNewsSearchOptions = SearchOptions & {
  sort?: "date" | "relevance";
};

export async function hnSearch(options: HackerNewsSearchOptions): Promise<HackerNewsSearchResult> {
  const { sort = "relevance", ...rest } = options;

  switch (sort) {
    case "date":
      return searchByDate(rest);
    case "relevance":
      return searchByRelevance(rest);
    default:
      throw new Error(`Unknown sort: ${sort}`);
  }
}

type HackerNewsParameter = Omit<HackerNewsSearchOptions, "sort" | "client">;

export function buildQueryString({ query, tags, filters }: HackerNewsParameter): URLSearchParams {
  const queryString = new URLSearchParams();

  if (query) {
    queryString.set("query", query);
  }

  if (tags && tags.length > 0) {
    queryString.set("tags", buildTagQueryString(tags));
  }

  if (filters && filters.length > 0) {
    queryString.set("numericFilters", buildFilterQueryString(filters));
  }

  return queryString;
}

export function buildFilterQueryString(filters: HackerNewsFilter[]): string {
  return filters.map((filter) => filter.join("")).join(",");
}

export function buildTagQueryString(tags: HackerNewsTag[]): string {
  return tags.join(",");
}
