import { buildFilterQueryString } from "./query.js";
import type {
  HackerNewsFilter,
  HackerNewsSearchOptions,
  HackerNewsSearchResult,
  HackerNewsTag,
} from "./types.js";
import { validateSearchResult } from "./validate.js";

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

export async function hnSearch(options: HackerNewsSearchOptions): Promise<HackerNewsSearchResult> {
  const { client = fetch, sort = "relevance", ...parameters } = options;

  const url = new URL(getEndpoint(sort));
  for (const [key, value] of buildQueryString(parameters)) {
    url.searchParams.set(key, value);
  }

  const response = await client(url, {
    headers: {
      "User-Agent": "@sigsign/hn-search",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const json = await response.json();
  return validateSearchResult(json);
}

function getEndpoint(sort: "date" | "relevance"): string {
  switch (sort) {
    case "date":
      return "https://hn.algolia.com/api/v1/search_by_date";
    case "relevance":
      return "https://hn.algolia.com/api/v1/search";
    default:
      throw new Error(`Unknown sort: ${sort}`);
  }
}

type HackerNewsParameter = Omit<HackerNewsSearchOptions, "sort" | "client">;

export function buildQueryString({
  query,
  tags,
  filters,
  page,
  hitsPerPage,
}: HackerNewsParameter): URLSearchParams {
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

  if (typeof page === "number" && Number.isInteger(page)) {
    queryString.set("page", page.toString());
  }

  if (typeof hitsPerPage === "number" && Number.isInteger(hitsPerPage)) {
    queryString.set("hitsPerPage", hitsPerPage.toString());
  }

  return queryString;
}

export function buildTagQueryString(tags: HackerNewsTag[]): string {
  return tags.join(",");
}
