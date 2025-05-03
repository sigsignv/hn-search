import * as v from "valibot";

const IntegerSchema = v.pipe(v.number(), v.integer());

const MatchedContentSchema = v.object({
  _tags: v.array(v.string()),
  author: v.string(),
  children: v.optional(v.array(IntegerSchema)),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  num_comments: IntegerSchema,
  points: IntegerSchema,
  story_id: IntegerSchema,
  title: v.string(),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  url: v.optional(v.pipe(v.string(), v.url())),
});

const SearchResultSchema = v.object({
  hits: v.array(MatchedContentSchema),
  hitsPerPage: IntegerSchema,
  nbHits: IntegerSchema,
  nbPages: IntegerSchema,
  page: IntegerSchema,
  params: v.pipe(
    v.string(),
    v.transform((value) => new URLSearchParams(value)),
  ),
  query: v.string(),
});

export type SearchResult = v.InferOutput<typeof SearchResultSchema>;
export type MatchedContent = v.InferOutput<typeof MatchedContentSchema>;

export function parse(json: unknown): SearchResult {
  const result = v.parse(SearchResultSchema, json);
  return result;
}
