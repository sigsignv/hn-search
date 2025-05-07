import * as v from "valibot";
import type {
  AlgoliaSearchResult,
  HackerNewsComment,
  HackerNewsPoll,
  HackerNewsPollOption,
  HackerNewsStory,
} from "./types.js";

const IntegerSchema = v.pipe(v.number(), v.integer());
const TimestampSchema = v.pipe(v.string(), v.isoTimestamp());

/**
 * @internal
 */
export const HighlightResultSchema = v.object({
  value: v.string(),
  matchLevel: v.picklist(["none", "partial", "full"]),
  matchedWords: v.array(v.string()),
  fullyHighlighted: v.optional(v.boolean()),
});

/**
 * @internal
 */
export const HackerNewsStorySchema = v.object({
  _highlightResult: v.object({
    author: HighlightResultSchema,
    story_text: v.optional(HighlightResultSchema),
    title: HighlightResultSchema,
    url: v.optional(HighlightResultSchema),
  }),
  _tags: v.array(v.string()),
  author: v.string(),
  children: v.optional(v.array(IntegerSchema)),
  created_at: TimestampSchema,
  num_comments: IntegerSchema,
  points: IntegerSchema,
  story_id: IntegerSchema,
  story_text: v.optional(v.string()),
  title: v.string(),
  updated_at: TimestampSchema,
  url: v.optional(v.pipe(v.string(), v.url())),
});

/**
 * @internal
 */
export const HackerNewsCommentSchema = v.object({
  _highlightResult: v.object({
    author: HighlightResultSchema,
    comment_text: HighlightResultSchema,
    story_title: HighlightResultSchema,
    story_url: v.optional(HighlightResultSchema),
  }),
  _tags: v.array(v.string()),
  author: v.string(),
  children: v.optional(v.array(IntegerSchema)),
  comment_text: v.string(),
  created_at: TimestampSchema,
  objectID: v.pipe(v.string(), v.digits()), // objectID can be used as id.
  parent_id: IntegerSchema,
  points: v.nullish(IntegerSchema),
  story_id: IntegerSchema,
  story_title: v.string(),
  story_url: v.optional(v.string()), // story_url can be an empty string or undefined.
  updated_at: TimestampSchema,
});

/**
 * @internal
 */
export const HackerNewsPollSchema = v.object({
  _highlightResult: v.object({
    author: HighlightResultSchema,
    title: HighlightResultSchema,
  }),
  _tags: v.array(v.string()),
  author: v.string(),
  children: v.optional(v.array(IntegerSchema)),
  created_at: TimestampSchema,
  num_comments: IntegerSchema,
  objectID: v.pipe(v.string(), v.digits()), // objectID can be used as id.
  parts: v.array(IntegerSchema),
  points: IntegerSchema,
  title: v.string(),
  updated_at: TimestampSchema,
});

/**
 * @internal
 */
export const HackerNewsPollOptionSchema = v.object({
  _highlightResult: v.strictObject({
    author: HighlightResultSchema,
  }),
  _tags: v.array(v.string()),
  author: v.string(),
  created_at: TimestampSchema,
  objectID: v.pipe(v.string(), v.digits()), // objectID can be used as id.
  points: IntegerSchema,
  updated_at: TimestampSchema,
});

/**
 * @see: https://www.algolia.com/doc/api-reference/api-methods/search/
 * @internal
 */
export const SearchResultSchema = v.object({
  exhaustive: v.object({
    nbHits: v.boolean(),
    typo: v.boolean(),
  }),
  hits: v.array(
    v.union([
      HackerNewsStorySchema,
      HackerNewsCommentSchema,
      HackerNewsPollSchema,
      HackerNewsPollOptionSchema,
    ]),
  ),
  hitsPerPage: IntegerSchema,
  nbHits: IntegerSchema,
  nbPages: IntegerSchema,
  page: IntegerSchema,
  params: v.string(),
  query: v.string(),
});

export function validateSearchResult(json: unknown): AlgoliaSearchResult {
  const r = v.parse(SearchResultSchema, json);

  return {
    exhaustive: r.exhaustive,
    hits: r.hits.map((hit) => {
      if (isHackerNewsStory(hit)) {
        return transformHackerNewsStory(hit);
      }
      if (isHackerNewsComment(hit)) {
        return transformHackerNewsComment(hit);
      }
      if (isHackerNewsPoll(hit)) {
        return transformHackerNewsPoll(hit);
      }
      if (isHackerNewsPollOption(hit)) {
        return transformHackerNewsPollOption(hit);
      }
      throw new Error(`Unknown hit type: ${JSON.stringify(hit)}`);
    }),
    hitsPerPage: r.hitsPerPage,
    nbHits: r.nbHits,
    nbPages: r.nbPages,
    page: r.page,
    params: new URLSearchParams(r.params),
    query: r.query,
  };
}

type HackerNewsContent =
  | HackerNewsStoryPayload
  | HackerNewsCommentPayload
  | HackerNewsPollPayload
  | HackerNewsPollOptionPayload;
type HackerNewsStoryPayload = v.InferOutput<typeof HackerNewsStorySchema>;
type HackerNewsCommentPayload = v.InferOutput<typeof HackerNewsCommentSchema>;
type HackerNewsPollPayload = v.InferOutput<typeof HackerNewsPollSchema>;
type HackerNewsPollOptionPayload = v.InferOutput<typeof HackerNewsPollOptionSchema>;

function transformHackerNewsStory(story: HackerNewsStoryPayload): HackerNewsStory {
  return {
    ...story,
    kind: "story",
    id: story.story_id,
    children: story.children ?? [],
    created_at: new Date(story.created_at),
    updated_at: new Date(story.updated_at),
  };
}

function transformHackerNewsComment(comment: HackerNewsCommentPayload): HackerNewsComment {
  const { objectID, ...rest } = comment;

  return {
    ...rest,
    kind: "comment",
    id: Number(objectID),
    children: comment.children ?? [],
    created_at: new Date(comment.created_at),
    updated_at: new Date(comment.updated_at),
  };
}

function transformHackerNewsPoll(poll: HackerNewsPollPayload): HackerNewsPoll {
  const { objectID, ...rest } = poll;

  return {
    ...rest,
    kind: "poll",
    id: Number(objectID),
    children: poll.children ?? [],
    created_at: new Date(poll.created_at),
    updated_at: new Date(poll.updated_at),
  };
}

function transformHackerNewsPollOption(pollOpt: HackerNewsPollOptionPayload): HackerNewsPollOption {
  const { objectID, ...rest } = pollOpt;

  return {
    ...rest,
    kind: "pollopt",
    id: Number(objectID),
    created_at: new Date(pollOpt.created_at),
    updated_at: new Date(pollOpt.updated_at),
  };
}

function isHackerNewsStory(json: HackerNewsContent): json is HackerNewsStoryPayload {
  return json._tags.includes("story");
}

function isHackerNewsComment(json: HackerNewsContent): json is HackerNewsCommentPayload {
  return json._tags.includes("comment");
}

function isHackerNewsPoll(json: HackerNewsContent): json is HackerNewsPollPayload {
  return json._tags.includes("poll");
}

function isHackerNewsPollOption(json: HackerNewsContent): json is HackerNewsPollOptionPayload {
  return json._tags.includes("pollopt");
}
