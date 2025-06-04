import * as v from "valibot";
import type { HackerNewsFilter, HackerNewsSearchOptions, HackerNewsTag } from "./types.js";
import { HackerNewsTagSchema } from "./validate.js";

type SearchParams = Omit<HackerNewsSearchOptions, "sort" | "client" | "signal">;

const PositiveIntegerSchema = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(0),
  v.transform((n) => n.toString()),
);

/**
 * Builds a URLSearchParams object from the given search parameters.
 *
 * @param params The search parameters to convert.
 * @returns The URLSearchParams object for the query.
 * @internal
 */
export function buildQueryString(params: SearchParams): URLSearchParams {
  const query = new URLSearchParams();

  if (params.query) {
    query.set("query", params.query);
  }

  if (params.tags) {
    const tags = buildQueryFromTags(params.tags);
    if (tags !== "") {
      query.set("tags", tags);
    }
  }

  if (params.filters) {
    const filters = buildQueryFromFilters(params.filters);
    if (filters !== "") {
      query.set("numericFilters", filters);
    }
  }

  if (params.page) {
    const page = v.parse(PositiveIntegerSchema, params.page, {
      message: "Invalid page number",
    });
    query.set("page", page);
  }

  if (params.hitsPerPage) {
    const hitsPerPage = v.parse(PositiveIntegerSchema, params.hitsPerPage, {
      message: "Invalid hitsPerPage number",
    });
    query.set("hitsPerPage", hitsPerPage);
  }

  return query;
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
