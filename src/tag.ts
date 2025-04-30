export type HackerNewsTag =
  | "story"
  | "comment"
  | "poll"
  | "pollopt"
  | "show_hn"
  | "ask_hn"
  | "front_page"
  | AuthorTag
  | StoryTag;

export type AuthorTag = `author_${string}`;
export type StoryTag = `story_${string}`;

export function authorTag(username: string): AuthorTag {
  if (username.length < 2) {
    throw new Error(`Must be at least 2 characters: ${username}`);
  }
  if (username.match(/[^a-zA-Z0-9_-]/)) {
    throw new Error(`Invalid username: ${username}`);
  }

  return `author_${username}`;
}

export function storyTag(id: number): StoryTag {
  if (id < 0) {
    throw new Error(`Must be a positive number: ${id}`);
  }

  return `story_${id}`;
}
