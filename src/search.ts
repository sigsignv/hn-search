import { type HttpClient, fetchClient } from "./client.js";
import { type HackerNewsFilter, buildFilterParam } from "./filter.js";
import { parse } from "./parse.js";
import type { HackerNewsTag } from "./tag.js";

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
  const { query, tags, filters, client = fetchClient } = options;

  const u = new URL(url);
  if (query) {
    u.searchParams.set("query", query);
  }
  if (tags) {
    u.searchParams.set("tags", tags.join(","));
  }
  if (filters) {
    u.searchParams.set("numericFilters", buildFilterParam(filters));
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
  const result = parse(json);

  return result;
}
