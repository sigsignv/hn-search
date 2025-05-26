import * as v from "valibot";
import type { HackerNewsFilter, HackerNewsSearchOptions, HackerNewsTag } from "./types.js";
import { HackerNewsTagSchema } from "./validate.js";

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
    queryString.set("tags", buildQueryFromTags(tags));
  }

  if (filters && filters.length > 0) {
    queryString.set("numericFilters", buildQueryFromFilters(filters));
  }

  if (typeof page === "number" && Number.isInteger(page)) {
    queryString.set("page", page.toString());
  }

  if (typeof hitsPerPage === "number" && Number.isInteger(hitsPerPage)) {
    queryString.set("hitsPerPage", hitsPerPage.toString());
  }

  return queryString;
}

const HackerNewsFilterSchema = v.tuple([
  v.picklist(["created_at_i", "points", "num_comments"]),
  v.picklist(["<", "<=", "=", ">", ">="]),
  v.pipe(v.number(), v.integer()),
]);

/**
 * Builds a query string from an array of filter conditions.
 *
 * @param filters An array of filter conditions.
 * @returns A query string representing the filter conditions.
 * @internal
 */
export function buildQueryFromFilters(filters: HackerNewsFilter[]): string {
  return filters
    .map((filter) => v.parse(HackerNewsFilterSchema, filter, { message: "Invalid filter format" }))
    .map((filter) => filter.join(""))
    .join(",");
}

/**
 * Builds a query string from an array of Hacker News tags.
 *
 * @param tags An array of Hacker News tags.
 * @returns A query string representing the tags.
 * @internal
 */
export function buildQueryFromTags(tags: HackerNewsTag[]): string {
  return tags
    .map((tag) => v.parse(HackerNewsTagSchema, tag, { message: "Invalid tag format" }))
    .join(",");
}
