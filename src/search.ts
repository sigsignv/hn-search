import { buildFilterQueryString, buildTagQueryString } from "./index.js";
import type { HackerNewsFilter, HackerNewsTag, HttpClient } from "./types.js";
import { validateSearchResult } from "./validate.js";

export type SearchOptions = {
  query?: string;
  tags?: HackerNewsTag[];
  filters?: HackerNewsFilter[];
  client?: HttpClient;
};

export async function searchByDate(options: SearchOptions) {
  return search("https://hn.algolia.com/api/v1/search_by_date", options);
}

export async function searchByRelevance(options: SearchOptions) {
  return search("https://hn.algolia.com/api/v1/search", options);
}

async function search(url: string, options: SearchOptions) {
  const { query, tags, filters, client = fetch } = options;

  const u = new URL(url);
  if (query) {
    u.searchParams.set("query", query);
  }
  if (tags) {
    u.searchParams.set("tags", buildTagQueryString(tags));
  }
  if (filters) {
    u.searchParams.set("numericFilters", buildFilterQueryString(filters));
  }

  const response = await client(u, {
    headers: {
      "User-Agent": "@sigsign/hn-search",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const json = await response.json();
  const result = validateSearchResult(json);

  return result;
}
