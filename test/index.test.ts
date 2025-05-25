import { describe, expectTypeOf, it } from "vitest";
import { buildQueryString, buildTagQueryString, hnSearch } from "../src/index.ts";
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

describe.sequential("real API response validation", () => {
  it("should return a story result with valid fields", async ({ expect }) => {
    const r = await hnSearch({
      tags: ["story"],
      hitsPerPage: 1,
    });
    for (const hit of r.hits) {
      expect(hit.kind).toBe("story");
      expect(hit._tags).toContain("story");
    }
  });

  it("should return a comment result with valid fields", async ({ expect }) => {
    const r = await hnSearch({
      tags: ["comment"],
      hitsPerPage: 1,
    });
    for (const hit of r.hits) {
      expect(hit.kind).toBe("comment");
      expect(hit._tags).toContain("comment");
    }
  });

  it("should return a poll result with valid fields", async ({ expect }) => {
    const r = await hnSearch({
      tags: ["poll"],
      hitsPerPage: 1,
    });
    for (const hit of r.hits) {
      expect(hit.kind).toBe("poll");
      expect(hit._tags).toContain("poll");
    }
  });

  it("should return a poll option result with valid fields", async ({ expect }) => {
    const r = await hnSearch({
      tags: ["pollopt"],
      hitsPerPage: 1,
    });
    for (const hit of r.hits) {
      expect(hit.kind).toBe("pollopt");
      expect(hit._tags).toContain("pollopt");
    }
  });

  it("should return a job result with valid fields", async ({ expect }) => {
    const r = await hnSearch({
      tags: ["job"],
      hitsPerPage: 1,
    });
    for (const hit of r.hits) {
      expect(hit.kind).toBe("job");
      expect(hit._tags).toContain("job");
    }
  });

  it("should return a result with correct fields when specifying page", async ({ expect }) => {
    const r = await hnSearch({
      page: 2,
      hitsPerPage: 1,
    });
    expect(r.page).toBe(2);
    expect(r.hitsPerPage).toBe(1);
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
