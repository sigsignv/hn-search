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
};

export type HackerNewsStory = HackerNewsItem<"story"> & {
  _highlightResult: {
    author: AlgoliaHighlightResult;
    story_text?: AlgoliaHighlightResult | undefined;
    title: AlgoliaHighlightResult;
    url?: AlgoliaHighlightResult | undefined;
  };
  author: string;
  children: number[];
  num_comments: number;
  points: number;
  story_text?: string | undefined;
  title: string;
  url?: string | undefined;
};

export type HackerNewsComment = HackerNewsItem<"comment"> & {
  _highlightResult: {
    author: AlgoliaHighlightResult;
    comment_text: AlgoliaHighlightResult;
    story_title: AlgoliaHighlightResult;
    story_url?: AlgoliaHighlightResult | undefined;
  };
  author: string;
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
    author: AlgoliaHighlightResult;
    title: AlgoliaHighlightResult;
  };
  author: string;
  children: number[];
  num_comments: number;
  parts: number[];
  points: number;
  title: string;
};

export type HackerNewsPollOption = HackerNewsItem<"pollopt"> & {
  _highlightResult: {
    author: AlgoliaHighlightResult;
  };
  author: string;
  points: number;
};

export type HackerNewsJob = HackerNewsItem<"job"> & {
  _highlightResult: {
    author: AlgoliaHighlightResult;
    title: AlgoliaHighlightResult;
    url?: AlgoliaHighlightResult | undefined;
  };
  author: string;
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

export type HttpClient = typeof fetch;
