import { parse } from "./parse.js";
import { type Transport, fetchTransport } from "./transport.js";

export type SearchOptions = {
  query: string;
  transport?: Transport;
};

export async function searchByDate(options: SearchOptions) {
  return search("https://hn.algolia.com/api/v1/search_by_date", options);
}

export async function searchByRelevance(options: SearchOptions) {
  return search("https://hn.algolia.com/api/v1/search", options);
}

async function search(url: string, options: SearchOptions) {
  const { query } = options;

  const u = new URL(url);
  u.searchParams.set("query", query);

  const transport = options.transport ?? fetchTransport;
  const response = await transport({
    url: u,
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
