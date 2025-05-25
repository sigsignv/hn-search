import { describe, it } from "vitest";
import { buildQueryFromFilters } from "../src/query.ts";

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
