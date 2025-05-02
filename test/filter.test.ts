import { describe, it } from "vitest";
import { type HackerNewsFilter, buildFilterParam } from "../src/filter.ts";

describe("filter", () => {
  it("Should build filter param string from multiple filter conditions", async ({ expect }) => {
    const filters: HackerNewsFilter[] = [
      { field: "created_at_i", operator: "<", value: 1700000000 },
      { field: "points", operator: ">", value: 100 },
      { field: "num_comments", operator: ">=", value: 10 },
    ];
    const param = buildFilterParam(filters);
    expect(param).toBe("created_at_i<1700000000,points>100,num_comments>=10");
  });
});
