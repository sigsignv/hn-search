import { describe, expectTypeOf, it } from "vitest";
import { hnSearch } from "../src/index.ts";
import type { HttpClient } from "../src/types.ts";

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

describe("HttpClient", () => {
  it("should be compatible with fetch", () => {
    expectTypeOf(fetch).toEqualTypeOf<HttpClient>();
  });
});
