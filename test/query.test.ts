import { describe, it } from "vitest";
import { buildQueryFromFilters, buildQueryFromTags, buildQueryString } from "../src/query.ts";

describe("buildQueryString", () => {
  it("should build query string with all parameters", ({ expect }) => {
    const params = buildQueryString({
      query: "example",
      tags: ["story", "author_dang"],
      filters: [["points", ">", 100]],
      hitsPerPage: 10,
    });
    expect(params.get("query")).toBe("example");
    expect(params.get("tags")).toBe("story,author_dang");
    expect(params.get("numericFilters")).toBe("points>100");
    expect(params.get("hitsPerPage")).toBe("10");
  });

  it("should build query string with only query", ({ expect }) => {
    const params = buildQueryString({
      query: "example",
    });
    expect(params.get("query")).toBe("example");
    expect(params.size).toBe(1);
  });

  it("should build query string with only tags", ({ expect }) => {
    const params = buildQueryString({
      tags: ["story"],
    });
    expect(params.get("tags")).toBe("story");
    expect(params.size).toBe(1);
  });

  it("should build query string with only filters", ({ expect }) => {
    const params = buildQueryString({
      filters: [
        ["points", ">", 100],
        ["num_comments", ">=", 10],
      ],
    });
    expect(params.get("numericFilters")).toBe("points>100,num_comments>=10");
    expect(params.size).toBe(1);
  });

  it("should build query string with only page", ({ expect }) => {
    const params = buildQueryString({
      page: 2,
    });
    expect(params.get("page")).toBe("2");
    expect(params.size).toBe(1);
  });

  it("should build query string with only hitsPerPage", ({ expect }) => {
    const params = buildQueryString({
      hitsPerPage: 10,
    });
    expect(params.get("hitsPerPage")).toBe("10");
    expect(params.size).toBe(1);
  });

  it("should build empty query string if all parameters are empty", ({ expect }) => {
    const params = buildQueryString({});
    expect(params.size).toBe(0);
  });

  it("should treat empty arrays for tags and filters the same as omitting them", ({ expect }) => {
    const params = buildQueryString({
      tags: [],
      filters: [],
    });
    expect(params.size).toBe(0);
  });
});

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
