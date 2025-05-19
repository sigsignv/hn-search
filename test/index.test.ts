import { describe, expectTypeOf, it } from "vitest";
import type { HackerNewsFilter } from "../src/index.ts";
import {
  buildFilterQueryString,
  buildQueryString,
  buildTagQueryString,
  hnSearch,
} from "../src/index.ts";
import type { HackerNewsTag, HttpClient } from "../src/types.ts";

describe("example", () => {
  it("should run example from README successfully", async ({ expect }) => {
    const r = await hnSearch({
      query: "example",
      tags: ["story"],
      sort: "date",
      filters: [["points", ">", 100]],
    });
    expect(r.query).toBe("example");
    for (const hit of r.hits) {
      expect(hit._tags).toContain("story");
      if (hit.kind === "story") {
        expect(hit.points).toBeGreaterThan(100);
      }
    }
  });
});

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

describe("buildFilterQueryString", () => {
  it("should return a query string for multiple filter conditions", async ({ expect }) => {
    const filters: HackerNewsFilter[] = [
      ["created_at_i", "<", 1700000000],
      ["points", ">", 100],
      ["num_comments", ">=", 10],
    ];
    const param = buildFilterQueryString(filters);
    expect(param).toBe("created_at_i<1700000000,points>100,num_comments>=10");
  });

  it("should return a query string for a single filter condition", async ({ expect }) => {
    const filters: HackerNewsFilter[] = [["created_at_i", "<", 1700000000]];
    const param = buildFilterQueryString(filters);
    expect(param).toBe("created_at_i<1700000000");
  });

  it("should return an empty string for no filter conditions", async ({ expect }) => {
    const filters: HackerNewsFilter[] = [];
    const param = buildFilterQueryString(filters);
    expect(param).toBe("");
  });
});

describe("buildTagQueryString", () => {
  it("should return a comma-separated string for multiple tags", ({ expect }) => {
    const tags: HackerNewsTag[] = ["story", "author_dang"];
    const param = buildTagQueryString(tags);
    expect(param).toBe("story,author_dang");
  });

  it("should return the tag itself for a single tag", ({ expect }) => {
    const tags: HackerNewsTag[] = ["story"];
    const param = buildTagQueryString(tags);
    expect(param).toBe("story");
  });

  it("should return an empty string for no tags", ({ expect }) => {
    const tags: HackerNewsTag[] = [];
    const param = buildTagQueryString(tags);
    expect(param).toBe("");
  });
});

describe("HttpClient", () => {
  it("should be compatible with fetch", () => {
    expectTypeOf(fetch).toEqualTypeOf<HttpClient>();
  });
});
