export type AlgoliaSearchResult = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  hits: Array<HackerNewsStory | HackerNewsComment>;
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
  fullyHighlighted?: boolean;
};

export type HackerNewsStory = {
  kind: "story";
  _highlightResult: {
    author: AlgoliaHighlightResult;
    title: AlgoliaHighlightResult;
    url: AlgoliaHighlightResult;
  };
  _tags: string[];
  author: string;
  children: number[];
  created_at: Date;
  num_comments: number;
  points: number;
  story_id: number;
  story_text?: string;
  title: string;
  updated_at: Date;
  url?: string;
};

export type HackerNewsComment = {
  kind: "comment";
  _highlightResult: {
    author: AlgoliaHighlightResult;
    comment_text: AlgoliaHighlightResult;
    story_title: AlgoliaHighlightResult;
    story_url: AlgoliaHighlightResult;
  };
  _tags: string[];
  author: string;
  children: number[];
  comment_id: number;
  comment_text: string;
  created_at: Date;
  parent_id: number;
  points: number | null;
  story_id: number;
  story_title: string;
  story_url?: string;
  updated_at: Date;
};
