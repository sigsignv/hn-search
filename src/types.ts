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
} & HighlightField<{ author: string }>;

type HighlightField<T extends object> = T & {
  _highlightResult: {
    [K in keyof T]: AlgoliaHighlightResult;
  };
};

export type HackerNewsStory = HackerNewsItem<"story"> & {
  _highlightResult: {
    story_text?: AlgoliaHighlightResult | undefined;
    title: AlgoliaHighlightResult;
    url?: AlgoliaHighlightResult | undefined;
  };
  children: number[];
  num_comments: number;
  points: number;
  story_text?: string | undefined;
  title: string;
  url?: string | undefined;
};

export type HackerNewsComment = HackerNewsItem<"comment"> & {
  _highlightResult: {
    comment_text: AlgoliaHighlightResult;
    story_title: AlgoliaHighlightResult;
    story_url?: AlgoliaHighlightResult | undefined;
  };
  children: number[];
  comment_text: string;
  parent_id: number;
  points?: number | null | undefined;
  story_id: number;
  story_title: string;
  story_url?: string | undefined;
};

export type HackerNewsPoll = HackerNewsItem<"poll"> & {
  _highlightResult: {
    title: AlgoliaHighlightResult;
  };
  children: number[];
  num_comments: number;
  parts: number[];
  points: number;
  title: string;
};

export type HackerNewsPollOption = HackerNewsItem<"pollopt"> & {
  points: number;
};

export type HackerNewsJob = HackerNewsItem<"job"> & {
  _highlightResult: {
    title: AlgoliaHighlightResult;
    url?: AlgoliaHighlightResult | undefined;
  };
  job_text?: string | undefined;
  title: string;
  url?: string | undefined;
};

/**
 * Hacker News tags are used to categorize items on Hacker News.
 *
 * Note: "job" and "launch_hn" are not documented in the official API.
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
 * Tuple type representing a filter condition for Hacker News search.
 *
 * Format: [field, operator, value]
 *   - field: "created_at_i" | "points" | "num_comments"
 *     - "created_at_i": Creation time (UNIX timestamp in seconds)
 *     - "points": Score (number of points)
 *     - "num_comments": Number of comments
 *   - operator: "<" | "<=" | "=" | ">" | ">="
 *   - value: number (the value to compare)
 *
 * Example: ["points", ">", 100] searches for items with more than 100 points.
 *
 * @see https://hn.algolia.com/api
 */
export type HackerNewsFilter = [HackerNewsFilterField, HackerNewsFilterOperator, number];
type HackerNewsFilterField = "created_at_i" | "points" | "num_comments";
type HackerNewsFilterOperator = "<" | "<=" | "=" | ">" | ">=";

export type HttpClient = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
