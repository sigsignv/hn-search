import * as v from "valibot";
import type { HackerNewsFilter } from "./types.js";

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
    .map((filter) => v.parse(HackerNewsFilterSchema, filter))
    .map((filter) => filter.join(""))
    .join(",");
}
