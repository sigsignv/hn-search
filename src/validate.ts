import * as v from "valibot";
import type {
  AlgoliaSearchResult,
  HackerNewsComment,
  HackerNewsPoll,
  HackerNewsStory,
} from "./types.js";

const IntegerSchema = v.pipe(v.number(), v.integer());
const TimestampSchema = v.pipe(v.string(), v.isoTimestamp());

export const HighlightResultSchema = v.object({
  value: v.string(),
  matchLevel: v.picklist(["none", "partial", "full"]),
  matchedWords: v.array(v.string()),
  fullyHighlighted: v.optional(v.boolean()),
});

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
  objectID: v.pipe(v.string(), v.digits()), // objectID can be used as comment_id.
  parent_id: IntegerSchema,
  points: v.nullish(IntegerSchema),
  story_id: IntegerSchema,
  story_title: v.string(),
  story_url: v.optional(v.string()), // story_url can be an empty string or undefined.
  updated_at: TimestampSchema,
});

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
  objectID: v.pipe(v.string(), v.digits()), // objectID can be used as poll_id.
  parts: v.array(IntegerSchema),
  points: IntegerSchema,
  title: v.string(),
  updated_at: TimestampSchema,
});

/**
 * ref: https://www.algolia.com/doc/api-reference/api-methods/search/
 */
export const SearchResultSchema = v.object({
  exhaustive: v.object({
    nbHits: v.boolean(),
    typo: v.boolean(),
  }),
  hits: v.array(v.union([HackerNewsStorySchema, HackerNewsCommentSchema, HackerNewsPollSchema])),
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
        return convertHackerNewsStory(hit);
      }
      if (isHackerNewsComment(hit)) {
        return convertHackerNewsComment(hit);
      }
      if (isHackerNewsPoll(hit)) {
        return convertHackerNewsPoll(hit);
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

type HackerNewsContent = HackerNewsStoryPayload | HackerNewsCommentPayload | HackerNewsPollPayload;
type HackerNewsStoryPayload = v.InferOutput<typeof HackerNewsStorySchema>;
type HackerNewsCommentPayload = v.InferOutput<typeof HackerNewsCommentSchema>;
type HackerNewsPollPayload = v.InferOutput<typeof HackerNewsPollSchema>;

function convertHackerNewsStory(story: HackerNewsStoryPayload): HackerNewsStory {
  return {
    ...story,
    kind: "story",
    children: story.children ?? [],
    created_at: new Date(story.created_at),
    updated_at: new Date(story.updated_at),
  };
}

function convertHackerNewsComment(comment: HackerNewsCommentPayload): HackerNewsComment {
  return {
    ...comment,
    kind: "comment",
    children: comment.children ?? [],
    comment_id: Number(comment.objectID),
    created_at: new Date(comment.created_at),
    updated_at: new Date(comment.updated_at),
  };
}

function convertHackerNewsPoll(poll: HackerNewsPollPayload): HackerNewsPoll {
  return {
    ...poll,
    kind: "poll",
    children: poll.children ?? [],
    created_at: new Date(poll.created_at),
    poll_id: Number(poll.objectID),
    updated_at: new Date(poll.updated_at),
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
