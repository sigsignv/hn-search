import { describe, it } from "vitest";
import { type HackerNewsFilter, buildFilterQueryString } from "../src/index.ts";
import { hnSearch } from "../src/index.ts";

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
  it("Should build filter param string from multiple filter conditions", async ({ expect }) => {
    const filters: HackerNewsFilter[] = [
      ["created_at_i", "<", 1700000000],
      ["points", ">", 100],
      ["num_comments", ">=", 10],
    ];
    const param = buildFilterQueryString(filters);
    expect(param).toBe("created_at_i<1700000000,points>100,num_comments>=10");
  });
});
