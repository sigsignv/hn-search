export type HackerNewsSearchResult = AlgoliaSearchResult;

/**
 * @see https://www.algolia.com/doc/api-reference/api-methods/search/
 */
export type AlgoliaSearchResult = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  hits: Array<HackerNewsStory | HackerNewsComment | HackerNewsPoll | HackerNewsPollOption>;
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

export type HackerNewsStory = {
  kind: "story";
  id: number;
  _highlightResult: {
    author: AlgoliaHighlightResult;
    story_text?: AlgoliaHighlightResult | undefined;
    title: AlgoliaHighlightResult;
    url?: AlgoliaHighlightResult | undefined;
  };
  _tags: HackerNewsTag[];
  author: string;
  children: number[];
  created_at: Date;
  num_comments: number;
  points: number;
  story_text?: string | undefined;
  title: string;
  updated_at: Date;
  url?: string | undefined;
};

export type HackerNewsComment = {
  kind: "comment";
  id: number;
  _highlightResult: {
    author: AlgoliaHighlightResult;
    comment_text: AlgoliaHighlightResult;
    story_title: AlgoliaHighlightResult;
    story_url?: AlgoliaHighlightResult | undefined;
  };
  _tags: HackerNewsTag[];
  author: string;
  children: number[];
  comment_text: string;
  created_at: Date;
  parent_id: number;
  points?: number | null | undefined;
  story_id: number;
  story_title: string;
  story_url?: string | undefined;
  updated_at: Date;
};

export type HackerNewsPoll = {
  kind: "poll";
  id: number;
  _highlightResult: {
    author: AlgoliaHighlightResult;
    title: AlgoliaHighlightResult;
  };
  _tags: HackerNewsTag[];
  author: string;
  children: number[];
  created_at: Date;
  num_comments: number;
  parts: number[];
  points: number;
  title: string;
  updated_at: Date;
};

export type HackerNewsPollOption = {
  kind: "pollopt";
  id: number;
  _highlightResult: {
    author: AlgoliaHighlightResult;
  };
  _tags: HackerNewsTag[];
  author: string;
  created_at: Date;
  points: number;
  updated_at: Date;
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
