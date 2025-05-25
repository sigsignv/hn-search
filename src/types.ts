export type HackerNewsSearchOptions = {
  query?: string;
  tags?: HackerNewsTag[];
  filters?: HackerNewsFilter[];
  page?: number;
  hitsPerPage?: number;

  sort?: "date" | "relevance";

  client?: HttpClient;
};

export type HackerNewsSearchResult = AlgoliaSearchResult<
  HackerNewsStory | HackerNewsComment | HackerNewsPoll | HackerNewsPollOption | HackerNewsJob
>;

/**
 * @see https://www.algolia.com/doc/api-reference/api-methods/search/
 */
export type AlgoliaSearchResult<T> = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  hits: Array<T>;
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;
  params: URLSearchParams;
  query: string;
};

export type AlgoliaHighlightResult = {
  value: string;
  matchLevel: "none" | "partial" | "full";
  matchedWords: string[];
  fullyHighlighted?: boolean | undefined;
};

type HackerNewsItem<T extends string> = {
  kind: T;
  id: number;
  _tags: HackerNewsTag[];
  created_at: Date;
  updated_at: Date;
} & HighlightFields<{ author: string }>;

type HighlightFields<T extends object> = T & {
  _highlightResult: {
    [K in keyof T]: AlgoliaHighlightResult;
  };
};

/**
 * Utility type that expands intersection types for better readability in editors.
 */
type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: K extends "_highlightResult" ? Expand<O[K]> : O[K] }
    : never
  : T;

/**
 * Represents a story item from Hacker News as returned by the Algolia API.
 *
 * - Most stories have a `url`.
 * - `ask_hn` posts usually have `story_text` instead of `url`.
 * - Normally, a story has either `url` or `story_text`, not both.
 * - The type allows both or neither, but you almost never see these cases.
 */
export type HackerNewsStory =
  | Expand<HackerNewsStoryBase>
  | Expand<HackerNewsStoryBase & HighlightFields<{ story_text: string }>>
  | Expand<HackerNewsStoryBase & HighlightFields<{ url: string }>>
  | Expand<HackerNewsStoryBase & HighlightFields<{ story_text: string; url: string }>>;

type HackerNewsStoryBase = HackerNewsItem<"story"> &
  HighlightFields<{
    title: string;
  }> & {
    children: number[];
    num_comments: number;
    points: number;
  };

/**
 * Represents a comment item from Hacker News as returned by the Algolia API.
 *
 * - If the root item (usually a story) has a `url`, this comment will have `story_url`.
 * - If not, `story_url` will not be present.
 */
export type HackerNewsComment =
  | Expand<HackerNewsCommentBase>
  | Expand<HackerNewsCommentBase & HighlightFields<{ story_url: string }>>;

type HackerNewsCommentBase = HackerNewsItem<"comment"> &
  HighlightFields<{
    comment_text: string;
    story_title: string;
  }> & {
    children: number[];
    parent_id: number;
    story_id: number;
  };

/**
 * Represents a poll item from Hacker News as returned by the Algolia API.
 */
export type HackerNewsPoll = Expand<HackerNewsPollBase>;

type HackerNewsPollBase = HackerNewsItem<"poll"> &
  HighlightFields<{
    title: string;
  }> & {
    children: number[];
    num_comments: number;
    parts: number[];
    points: number;
  };

/**
 * Represents a poll option item from Hacker News as returned by the Algolia API.
 */
export type HackerNewsPollOption = Expand<HackerNewsPollOptionBase>;

type HackerNewsPollOptionBase = HackerNewsItem<"pollopt"> & {
  points: number;
};

/**
 * Represents a job item from Hacker News as returned by the Algolia API.
 *
 * - Most jobs have a `url`.
 * - Some jobs have a `job_text` instead of `url`.
 * - The `job_text` field is not included in `_highlightResult` and may not be searchable.
 */
export type HackerNewsJob =
  | Expand<HackerNewsJobBase>
  | Expand<HackerNewsJobBase & HighlightFields<{ url: string }>>;

type HackerNewsJobBase = HackerNewsItem<"job"> &
  HighlightFields<{
    title: string;
  }> & {
    job_text?: string | undefined;
  };

/**
 * Tags are used to group items on Hacker News.
 *
 * Possible tags:
 *   - `story`
 *   - `comment`
 *   - `poll`
 *   - `pollopt`
 *   - `job`
 *   - `ask_hn`
 *   - `show_hn`
 *   - `launch_hn`
 *   - `front_page`
 *   - `author_{username}`: Items by a specific author (e.g., "author_dang")
 *   - `story_{id}`: Items belonging to a specific story (e.g., "story_12345")
 *
 * Note: `job` and `launch_hn` are not listed in the official documentation.
 *
 * @see https://hn.algolia.com/api
 */
export type HackerNewsTag =
  | "story"
  | "comment"
  | "poll"
  | "pollopt"
  | "job"
  | "ask_hn"
  | "show_hn"
  | "launch_hn"
  | "front_page"
  | `author_${string}`
  | `story_${number}`;

/**
 * A tuple that describes a filter for Hacker News search.
 *
 * Format: [field, operator, value]
 *   - field: "created_at_i" | "points" | "num_comments"
 *     - "created_at_i": Creation time (UNIX timestamp in seconds)
 *     - "points": Score (number of points)
 *     - "num_comments": Number of comments
 *   - operator: "<" | "<=" | "=" | ">" | ">="
 *   - value: number (the number to compare)
 *
 * Example: ["points", ">", 100] finds items with more than 100 points.
 *
 * @see https://hn.algolia.com/api
 */
export type HackerNewsFilter = [HackerNewsFilterField, HackerNewsFilterOperator, number];
type HackerNewsFilterField = "created_at_i" | "points" | "num_comments";
type HackerNewsFilterOperator = "<" | "<=" | "=" | ">" | ">=";

export type HttpClient = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
