import type { AlgoliaSearchResult } from "./types.js";
import { validateSearchResult } from "./validate.js";

export function parse(json: unknown): AlgoliaSearchResult {
  const result = validateSearchResult(json);
  return result;
}
