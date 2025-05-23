import * as v from "valibot";
import { describe, expectTypeOf, it } from "vitest";
import type {
  AlgoliaHighlightResult,
  HackerNewsComment,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsPollOption,
  HackerNewsStory,
} from "../src/types.js";
import {
  HackerNewsCommentSchema,
  HackerNewsJobSchema,
  HackerNewsPollOptionSchema,
  HackerNewsPollSchema,
  HackerNewsStorySchema,
  HackerNewsTagSchema,
  HighlightResultSchema,
  SearchResultSchema,
  validateSearchResult,
} from "../src/validate.ts";

describe("HighlightResultSchema", () => {
  it("should validate a highlight result with a 'full' matchLevel", ({ expect }) => {
    const highlight = {
      value: "example",
      matchLevel: "full",
      matchedWords: ["example"],
      fullyHighlighted: true,
    };
    const result = v.safeParse(HighlightResultSchema, highlight);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(highlight);
      expectTypeOf(result.output).toEqualTypeOf<AlgoliaHighlightResult>();
    }
  });

  it("should validate a highlight result with a 'none' matchLevel", ({ expect }) => {
    const highlight = {
      value: "example",
      matchLevel: "none",
      matchedWords: [],
    };
    const result = v.safeParse(HighlightResultSchema, highlight);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(highlight);
      expectTypeOf(result.output).toEqualTypeOf<AlgoliaHighlightResult>();
    }
  });

  it("should reject a highlight result with an invalid matchLevel value", ({ expect }) => {
    const highlight = {
      value: "example",
      matchLevel: "invalid",
      matchedWords: [],
    };
    const result = v.safeParse(HighlightResultSchema, highlight);

    expect(result.success).toBe(false);
  });
});

describe("HackerNewsTagSchema", () => {
  it("should accept valid static tags", ({ expect }) => {
    expect(() => v.parse(HackerNewsTagSchema, "story")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "comment")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "poll")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "pollopt")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "job")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "ask_hn")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "show_hn")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "launch_hn")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "front_page")).not.toThrow();
  });

  it("should accept valid author tags", ({ expect }) => {
    // 'dang' is a well-known moderator on Hacker News
    expect(() => v.parse(HackerNewsTagSchema, "author_dang")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "author_john_doe")).not.toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "author_dang-dang-dang")).not.toThrow();
  });

  it("should reject invalid author tags", ({ expect }) => {
    expect(() => v.parse(HackerNewsTagSchema, "author_")).toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "author_u")).toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "author_@!?")).toThrow();
  });

  it("should accept valid story tags", ({ expect }) => {
    expect(() => v.parse(HackerNewsTagSchema, "story_12345")).not.toThrow();
  });

  it("should reject invalid story tags", ({ expect }) => {
    expect(() => v.parse(HackerNewsTagSchema, "story_")).toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "story_abc")).toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "story_-1")).toThrow();
  });

  it("should reject invalid tags", ({ expect }) => {
    expect(() => v.parse(HackerNewsTagSchema, "")).toThrow();
    expect(() => v.parse(HackerNewsTagSchema, "invalid tag")).toThrow();
  });
});

describe("HackerNewsStorySchema", () => {
  const createStory = (overrides = {}) => ({
    _highlightResult: {
      author: {
        value: "example_user",
        matchLevel: "none",
        matchedWords: [],
      },
      story_text: {
        value: "This is the full text of the story.",
        matchLevel: "none",
        matchedWords: [],
      },
      title: {
        value: "Example story title",
        matchLevel: "none",
        matchedWords: [],
      },
      url: {
        value: "https://example.com/story/url",
        matchLevel: "none",
        matchedWords: [],
      },
    },
    _tags: ["story", "author_example_user", "story_12345"],
    author: "example_user",
    children: [123451, 123452],
    created_at: "2023-10-26T10:00:00.000Z",
    num_comments: 2,
    points: 100,
    story_id: 12345,
    story_text: "This is the full text of the story.",
    title: "Example story title",
    updated_at: "2023-10-26T11:00:00.000Z",
    url: "https://example.com/story/url",
    ...overrides,
  });

  it("should validate a story with all fields present", ({ expect }) => {
    const validStory = createStory();
    const result = v.safeParse(HackerNewsStorySchema, validStory);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(validStory);
    }
  });

  it("should validate a story when optional 'children' field is omitted", ({ expect }) => {
    const { children, ...storyWithoutChildren } = createStory();
    const result = v.safeParse(HackerNewsStorySchema, storyWithoutChildren);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.children).toBeUndefined();
    }
  });

  it("should validate a story when optional 'story_text' field is omitted", ({ expect }) => {
    const { story_text, ...storyWithoutStoryText } = createStory();
    const result = v.safeParse(HackerNewsStorySchema, storyWithoutStoryText);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.story_text).toBeUndefined();
    }
  });

  it("should validate a story when optional 'url' field is omitted", ({ expect }) => {
    const { url, ...storyWithoutUrl } = createStory({
      tags: ["story", "author_example_user", "story_12345", "ask_hn"],
    });
    const result = v.safeParse(HackerNewsStorySchema, storyWithoutUrl);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.url).toBeUndefined();
    }
  });

  it("should reject a story if 'points' is null", ({ expect }) => {
    const storyWithNullPoints = createStory({ points: null });
    const result = v.safeParse(HackerNewsStorySchema, storyWithNullPoints);

    expect(result.success).toBe(false);
  });
});

describe("HackerNewsCommentSchema", () => {
  const createComment = (overrides = {}) => ({
    _highlightResult: {
      author: {
        value: "example_user",
        matchLevel: "none",
        matchedWords: [],
      },
      comment_text: {
        value: "Example comment text",
        matchLevel: "none",
        matchedWords: [],
      },
      story_title: {
        value: "Example story title",
        matchLevel: "none",
        matchedWords: [],
      },
      story_url: {
        value: "https://example.com/story/url",
        matchLevel: "none",
        matchedWords: [],
      },
    },
    _tags: ["comment", "author_example_user", "story_12345"],
    author: "example_user",
    children: [123456, 123457],
    comment_text: "Example comment text",
    created_at: "2023-10-15T12:00:00.000Z",
    objectID: "123451",
    parent_id: 12345,
    story_id: 12345,
    story_title: "Example story title",
    story_url: "https://example.com/story/url",
    updated_at: "2023-10-15T14:00:00.000Z",
    ...overrides,
  });

  it("should validate a comment with all fields present", ({ expect }) => {
    const comment = createComment();
    const result = v.safeParse(HackerNewsCommentSchema, comment);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(comment);
    }
  });

  it("should validate a comment when optional 'children' field is omitted", ({ expect }) => {
    const { children, ...commentWithoutChildren } = createComment();
    const result = v.safeParse(HackerNewsCommentSchema, commentWithoutChildren);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.children).toBeUndefined();
    }
  });

  it("should validate a comment when optional 'story_url' field is omitted", ({ expect }) => {
    const { story_url, ...commentWithoutStoryUrl } = createComment({
      tags: ["story", "author_example_user", "story_12345", "ask_hn"],
    });
    const result = v.safeParse(HackerNewsCommentSchema, commentWithoutStoryUrl);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.story_url).toBeUndefined();
    }
  });

  it("should validate a comment when optional 'story_url' field is empty", ({ expect }) => {
    const commentWithNoStoryUrl = createComment({ story_url: "" });
    const result = v.safeParse(HackerNewsCommentSchema, commentWithNoStoryUrl);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.story_url).toBe("");
    }
  });

  it("should reject a comment if 'objectID' is not numeric", ({ expect }) => {
    const commentWithInvalidObjectID = createComment({ objectID: "invalid" });
    const result = v.safeParse(HackerNewsCommentSchema, commentWithInvalidObjectID);

    expect(result.success).toBe(false);
  });
});

describe("HackerNewsPollSchema", () => {
  const createPoll = (overrides = {}) => ({
    _highlightResult: {
      author: {
        value: "example_user",
        matchLevel: "none",
        matchedWords: [],
      },
      title: {
        value: "Example poll title",
        matchLevel: "none",
        matchedWords: [],
      },
    },
    _tags: ["poll", "author_example_user"],
    author: "example_user",
    children: [123451, 123452],
    created_at: "2023-10-26T10:00:00.000Z",
    num_comments: 10,
    objectID: "12345",
    parts: [123456, 123457],
    points: 50,
    title: "Example poll title",
    updated_at: "2023-10-26T11:00:00.000Z",
    ...overrides,
  });

  it("should validate a poll with all fields present", ({ expect }) => {
    const poll = createPoll();
    const result = v.safeParse(HackerNewsPollSchema, poll);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(poll);
    }
  });

  it("should validate a poll when optional 'children' field is omitted", ({ expect }) => {
    const { children, ...pollWithoutChildren } = createPoll();
    const result = v.safeParse(HackerNewsPollSchema, pollWithoutChildren);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.children).toBeUndefined();
    }
  });

  it("should reject a poll if 'objectID' is not numeric", ({ expect }) => {
    const pollWithInvalidObjectID = createPoll({ objectID: "invalid" });
    const result = v.safeParse(HackerNewsPollSchema, pollWithInvalidObjectID);

    expect(result.success).toBe(false);
  });

  it("should reject a poll if 'points' is null", ({ expect }) => {
    const pollWithNullPoints = createPoll({ points: null });
    const result = v.safeParse(HackerNewsPollSchema, pollWithNullPoints);

    expect(result.success).toBe(false);
  });
});

describe("HackerNewsPollOptionSchema", () => {
  const createPollOption = (overrides = {}) => ({
    _highlightResult: {
      author: {
        value: "example_user",
        matchLevel: "none",
        matchedWords: [],
      },
    },
    _tags: ["pollopt", "author_example_user"],
    author: "example_user",
    created_at: "2023-10-26T10:00:00.000Z",
    objectID: "12345",
    points: 10,
    updated_at: "2023-10-26T11:00:00.000Z",
    ...overrides,
  });

  it("should validate a poll option with all fields present", ({ expect }) => {
    const pollOption = createPollOption();
    const result = v.safeParse(HackerNewsPollOptionSchema, pollOption);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(pollOption);
    }
  });

  it("should reject a poll option if 'objectID' is not numeric", ({ expect }) => {
    const pollOptionWithInvalidObjectID = createPollOption({ objectID: "invalid" });
    const result = v.safeParse(HackerNewsPollOptionSchema, pollOptionWithInvalidObjectID);

    expect(result.success).toBe(false);
  });

  it("should reject a poll option if 'points' is null", ({ expect }) => {
    const pollOptionWithNullPoints = createPollOption({ points: null });
    const result = v.safeParse(HackerNewsPollOptionSchema, pollOptionWithNullPoints);

    expect(result.success).toBe(false);
  });
});

describe("HackerNewsJobSchema", () => {
  const createJob = (overrides = {}) => ({
    _highlightResult: {
      author: {
        value: "example_user",
        matchLevel: "none",
        matchedWords: [],
      },
      title: {
        value: "Example job title",
        matchLevel: "none",
        matchedWords: [],
      },
      url: {
        value: "https://example.com/job/url",
        matchLevel: "none",
        matchedWords: [],
      },
    },
    _tags: ["job", "author_example_user"],
    author: "example_user",
    created_at: "2023-10-26T10:00:00.000Z",
    job_text: "This is the full text of the job.",
    objectID: "12345",
    title: "Example job title",
    updated_at: "2023-10-26T11:00:00.000Z",
    url: "https://example.com/job/url",
    ...overrides,
  });

  it("should validate a job with all fields present", ({ expect }) => {
    const job = createJob();
    const result = v.safeParse(HackerNewsJobSchema, job);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(job);
    }
  });

  it("should validate a job when optional 'job_text' field is omitted", ({ expect }) => {
    const { job_text, ...jobWithoutJobText } = createJob();
    const result = v.safeParse(HackerNewsJobSchema, jobWithoutJobText);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.job_text).toBeUndefined();
    }
  });

  it("should validate a job when optional 'url' field is omitted", ({ expect }) => {
    const { url, ...jobWithoutUrl } = createJob();
    const result = v.safeParse(HackerNewsJobSchema, jobWithoutUrl);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.url).toBeUndefined();
    }
  });

  it("should reject a job if 'objectID' is not numeric", ({ expect }) => {
    const jobWithInvalidObjectID = createJob({ objectID: "invalid" });
    const result = v.safeParse(HackerNewsJobSchema, jobWithInvalidObjectID);

    expect(result.success).toBe(false);
  });
});

describe("SearchResultSchema", () => {
  const createSearchResult = (overrides = {}) => ({
    exhaustive: {
      nbHits: false,
      typo: false,
    },
    hits: [
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example story title",
            matchLevel: "none",
            matchedWords: [],
          },
          url: {
            value: "https://example.com/story/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["story", "author_example_user", "story_12345"],
        author: "example_user",
        children: [123451, 123452],
        created_at: "2023-10-26T10:00:00.000Z",
        num_comments: 2,
        points: 100,
        story_id: 12345,
        story_text: "This is the full text of the story.",
        title: "Example story title",
        updated_at: "2023-10-26T11:00:00.000Z",
        url: "https://example.com/story/url",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          comment_text: {
            value: "Example comment text",
            matchLevel: "none",
            matchedWords: [],
          },
          story_title: {
            value: "Example story title",
            matchLevel: "none",
            matchedWords: [],
          },
          story_url: {
            value: "https://example.com/story/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["comment", "author_example_user", "story_12345"],
        author: "example_user",
        children: [123456, 123457],
        comment_text: "Example comment text",
        created_at: "2023-10-15T12:00:00.000Z",
        objectID: "123451",
        parent_id: 12345,
        story_id: 12345,
        story_title: "Example story title",
        story_url: "https://example.com/story/url",
        updated_at: "2023-10-15T14:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example poll title",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["poll", "author_example_user"],
        author: "example_user",
        children: [123451, 123452],
        created_at: "2023-10-26T10:00:00.000Z",
        num_comments: 10,
        objectID: "12345",
        parts: [123456, 123457],
        points: 50,
        title: "Example poll title",
        updated_at: "2023-10-26T11:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["pollopt", "author_example_user"],
        author: "example_user",
        created_at: "2023-10-26T10:00:00.000Z",
        objectID: "12345",
        points: 10,
        updated_at: "2023-10-26T11:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example job title",
            matchLevel: "none",
            matchedWords: [],
          },
          url: {
            value: "https://example.com/job/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["job", "author_example_user"],
        author: "example_user",
        created_at: "2023-10-26T10:00:00.000Z",
        job_text: "This is the full text of the job.",
        objectID: "12345",
        title: "Example job title",
        updated_at: "2023-10-26T11:00:00.000Z",
        url: "https://example.com/job/url",
      },
    ],
    hitsPerPage: 20,
    nbHits: 100,
    nbPages: 5,
    page: 1,
    params: "query=example",
    query: "example",
    ...overrides,
  });

  it("should validate a search result with all fields present", ({ expect }) => {
    const searchResult = createSearchResult();
    const result = v.safeParse(SearchResultSchema, searchResult);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toEqual(searchResult);
    }
  });

  it("should validate a search result with an empty hits array", ({ expect }) => {
    const searchResultWithNoHits = createSearchResult({ hits: [] });
    const result = v.safeParse(SearchResultSchema, searchResultWithNoHits);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.hits).toEqual([]);
    }
  });
});

describe("validateSearchResult", () => {
  const createRawSearchResult = (overrides = {}) => ({
    exhaustive: {
      nbHits: false,
      typo: false,
    },
    hits: [
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example story title",
            matchLevel: "none",
            matchedWords: [],
          },
          url: {
            value: "https://example.com/story/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["story", "author_example_user", "story_12345"],
        author: "example_user",
        children: [123451, 123452],
        created_at: "2023-10-26T10:00:00.000Z",
        created_at_i: 1698314400,
        num_comments: 2,
        objectID: "12345",
        points: 100,
        story_id: 12345,
        story_text: "This is the full text of the story.",
        title: "Example story title",
        updated_at: "2023-10-26T11:00:00.000Z",
        url: "https://example.com/story/url",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          comment_text: {
            value: "Example comment text",
            matchLevel: "none",
            matchedWords: [],
          },
          story_title: {
            value: "Example story title",
            matchLevel: "none",
            matchedWords: [],
          },
          story_url: {
            value: "https://example.com/story/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["comment", "author_example_user", "story_12345"],
        author: "example_user",
        children: [123456, 123457],
        comment_text: "Example comment text",
        created_at: "2023-10-15T12:00:00.000Z",
        created_at_i: 1697371200,
        objectID: "123451",
        parent_id: 12345,
        story_id: 12345,
        story_title: "Example story title",
        story_url: "https://example.com/story/url",
        updated_at: "2023-10-15T14:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example poll title",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["poll", "author_example_user"],
        author: "example_user",
        children: [123451, 123452],
        created_at: "2023-10-26T10:00:00.000Z",
        num_comments: 10,
        objectID: "12345",
        parts: [123456, 123457],
        points: 50,
        title: "Example poll title",
        updated_at: "2023-10-26T11:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["pollopt", "author_example_user"],
        author: "example_user",
        created_at: "2023-10-26T10:00:00.000Z",
        objectID: "12345",
        points: 10,
        updated_at: "2023-10-26T11:00:00.000Z",
      },
      {
        _highlightResult: {
          author: {
            value: "example_user",
            matchLevel: "none",
            matchedWords: [],
          },
          title: {
            value: "Example job title",
            matchLevel: "none",
            matchedWords: [],
          },
          url: {
            value: "https://example.com/job/url",
            matchLevel: "none",
            matchedWords: [],
          },
        },
        _tags: ["job", "author_example_user"],
        author: "example_user",
        created_at: "2023-10-26T10:00:00.000Z",
        job_text: "This is the full text of the job.",
        objectID: "12345",
        title: "Example job title",
        updated_at: "2023-10-26T11:00:00.000Z",
        url: "https://example.com/job/url",
      },
    ],
    hitsPerPage: 20,
    nbHits: 100,
    nbPages: 5,
    page: 1,
    params: "query=example",
    query: "example",
    ...overrides,
  });

  it("should validate and convert a valid search result", ({ expect }) => {
    const rawSearchResult = createRawSearchResult();
    const result = validateSearchResult(rawSearchResult);

    expect(result.exhaustive).toEqual(rawSearchResult.exhaustive);
    expect(result.hits).toHaveLength(5);
    expect(result.hitsPerPage).toBe(rawSearchResult.hitsPerPage);
    expect(result.nbHits).toBe(rawSearchResult.nbHits);
    expect(result.nbPages).toBe(rawSearchResult.nbPages);
    expect(result.page).toBe(rawSearchResult.page);
    expect(result.params.toString()).toBe(rawSearchResult.params);
    expect(result.query).toBe(rawSearchResult.query);

    for (const hit of result.hits) {
      if (hit.kind === "story") {
        expectTypeOf(hit).toEqualTypeOf<HackerNewsStory>();
        expect(hit.id).toBe(12345);
        expect(hit.created_at).toBeInstanceOf(Date);
        expect(hit.updated_at).toBeInstanceOf(Date);
      }
      if (hit.kind === "comment") {
        expectTypeOf(hit).toEqualTypeOf<HackerNewsComment>();
        expect(hit.id).toBe(123451);
        expect(hit.created_at).toBeInstanceOf(Date);
        expect(hit.updated_at).toBeInstanceOf(Date);
      }
      if (hit.kind === "poll") {
        expectTypeOf(hit).toEqualTypeOf<HackerNewsPoll>();
        expect(hit.id).toBe(12345);
        expect(hit.created_at).toBeInstanceOf(Date);
        expect(hit.updated_at).toBeInstanceOf(Date);
      }
      if (hit.kind === "pollopt") {
        expectTypeOf(hit).toEqualTypeOf<HackerNewsPollOption>();
        expect(hit.id).toBe(12345);
        expect(hit.created_at).toBeInstanceOf(Date);
        expect(hit.updated_at).toBeInstanceOf(Date);
      }
      if (hit.kind === "job") {
        expectTypeOf(hit).toEqualTypeOf<HackerNewsJob>();
        expect(hit.id).toBe(12345);
        expect(hit.created_at).toBeInstanceOf(Date);
        expect(hit.updated_at).toBeInstanceOf(Date);
      }
    }
  });

  it("should handle an empty hits array", ({ expect }) => {
    const rawSearchResult = createRawSearchResult({ hits: [] });
    const result = validateSearchResult(rawSearchResult);

    expect(result.hits).toEqual([]);
  });
});
