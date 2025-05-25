import { describe, it } from "vitest";
import { buildQueryFromFilters, buildQueryFromTags } from "../src/query.ts";

describe("buildQueryFromFilters", () => {
  it("should return a query string for multiple filter conditions", async ({ expect }) => {
    const param = buildQueryFromFilters([
      ["created_at_i", "<", 1700000000],
      ["points", ">", 100],
      ["num_comments", ">=", 10],
    ]);
    expect(param).toBe("created_at_i<1700000000,points>100,num_comments>=10");
  });

  it("should return an empty string for no filter conditions", async ({ expect }) => {
    const query = buildQueryFromFilters([]);
    expect(query).toBe("");
  });

  it("should return a query string for created_at_i filter", async ({ expect }) => {
    const param = buildQueryFromFilters([["created_at_i", "<=", 1700000000]]);
    expect(param).toBe("created_at_i<=1700000000");
  });

  it("should return a query string for points filter", async ({ expect }) => {
    const param = buildQueryFromFilters([["points", ">=", 100]]);
    expect(param).toBe("points>=100");
  });

  it("should return a query string for num_comments filter", async ({ expect }) => {
    const param = buildQueryFromFilters([["num_comments", "=", 10]]);
    expect(param).toBe("num_comments=10");
  });

  it("should throw an error for invalid filter conditions", async ({ expect }) => {
    // @ts-expect-error: Testing invalid input
    expect(() => buildQueryFromFilters([["invalid_field", "!=", "-1"]])).toThrow();
  });
});

describe("buildQueryFromTagas", () => {
  it("should return a query string for multiple tags", ({ expect }) => {
    const param = buildQueryFromTags(["story", "author_dang", "story_12345"]);
    expect(param).toBe("story,author_dang,story_12345");
  });

  it("should return an empty string for no tags", ({ expect }) => {
    const param = buildQueryFromTags([]);
    expect(param).toBe("");
  });

  it("should return a query string for story tag", ({ expect }) => {
    const param = buildQueryFromTags(["story"]);
    expect(param).toBe("story");
  });

  it("should return a query string for comment tag", ({ expect }) => {
    const param = buildQueryFromTags(["comment"]);
    expect(param).toBe("comment");
  });

  it("should return a query string for poll tag", ({ expect }) => {
    const param = buildQueryFromTags(["poll"]);
    expect(param).toBe("poll");
  });

  it("should return a query string for pollopt tag", ({ expect }) => {
    const param = buildQueryFromTags(["pollopt"]);
    expect(param).toBe("pollopt");
  });

  it("should return a query string for job tag", ({ expect }) => {
    const param = buildQueryFromTags(["job"]);
    expect(param).toBe("job");
  });

  it("should return a query string for ask_hn tag", ({ expect }) => {
    const param = buildQueryFromTags(["ask_hn"]);
    expect(param).toBe("ask_hn");
  });

  it("should return a query string for show_hn tag", ({ expect }) => {
    const param = buildQueryFromTags(["show_hn"]);
    expect(param).toBe("show_hn");
  });

  it("should return a query string for launch_hn tag", ({ expect }) => {
    const param = buildQueryFromTags(["launch_hn"]);
    expect(param).toBe("launch_hn");
  });

  it("should return a query string for front_page tag", ({ expect }) => {
    const param = buildQueryFromTags(["front_page"]);
    expect(param).toBe("front_page");
  });

  it("should return a query string for author tag", ({ expect }) => {
    const param = buildQueryFromTags(["author_dang"]);
    expect(param).toBe("author_dang");
  });

  it("should return a query string for story tag with number", ({ expect }) => {
    const param = buildQueryFromTags(["story_12345"]);
    expect(param).toBe("story_12345");
  });

  it("should throw an error for invalid tag format", async ({ expect }) => {
    // @ts-expect-error: Testing invalid input
    expect(() => buildQueryFromTags(["invalid_tag"])).toThrow();
  });
});
