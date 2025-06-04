import { buildQueryString } from "./query.js";
import type { HackerNewsSearchOptions, HackerNewsSearchResult } from "./types.js";
import { validateSearchResult } from "./validate.js";

export type {
  HackerNewsSearchResult,
  HackerNewsStory,
  HackerNewsComment,
  HackerNewsPoll,
  HackerNewsPollOption,
  HackerNewsJob,
  HackerNewsSearchOptions,
  HackerNewsTag,
  HackerNewsFilter,
} from "./types.js";

export async function hnSearch(options: HackerNewsSearchOptions): Promise<HackerNewsSearchResult> {
  const { client = fetch, sort = "relevance", signal, ...parameters } = options;

  const url = new URL(getEndpoint(sort));
  for (const [key, value] of buildQueryString(parameters)) {
    url.searchParams.set(key, value);
  }

  const response = await client(url, {
    headers: {
      "User-Agent": "@sigsign/hn-search",
    },
    signal: signal ?? null,
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
