import { describe, expectTypeOf, it } from "vitest";
import type { HackerNewsFilter } from "../src/index.ts";
import { buildFilterQueryString, hnSearch } from "../src/index.ts";
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

describe("HttpClient", () => {
  it("should be compatible with fetch", () => {
    expectTypeOf(fetch).toEqualTypeOf<HttpClient>();
  });
});
