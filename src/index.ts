import { type SearchOptions, searchByDate, searchByRelevance } from "./search.js";

export type { HttpClient } from "./client.js";

export type { HackerNewsFilter } from "./filter.js";
export type { HackerNewsTag } from "./tag.js";
export { authorTag, storyTag } from "./tag.js";

export * from "./search.js";
export * from "./types.js";

export type HackerNewsSearchOptions = SearchOptions & {
  sort?: "date" | "relevance";
};

export async function hnSearch(options: HackerNewsSearchOptions) {
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
