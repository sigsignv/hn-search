import { describe, it } from "vitest";
import { authorTag, storyTag } from "../src/tag.ts";

describe("authorTag", () => {
  it("should return a valid author tag", async ({ expect }) => {
    // dang is Hacker News moderator
    const tag = authorTag("dang");
    expect(tag).toBe("author_dang");
  });

  it("should throw an error when username is too short", async ({ expect }) => {
    expect(() => authorTag("")).toThrowError(/^Must be at least 2 characters: /);
  });

  it("should throw an error when username contains invalid characters", async ({ expect }) => {
    expect(() => authorTag("dang!")).toThrowError(/^Invalid username: /);
  });
});

describe("storyTag", () => {
  it("should return a valid story tag", async ({ expect }) => {
    const tag = storyTag(123456789);
    expect(tag).toBe("story_123456789");
  });

  it("should throw an error when id is negative", async ({ expect }) => {
    expect(() => storyTag(-1)).toThrowError(/Must be a positive number: /);
  });
});
