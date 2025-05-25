import { describe, it } from "vitest";
import type { HackerNewsFilter } from "../src/index.ts";
import { buildFilterQueryString } from "../src/query.ts";

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
