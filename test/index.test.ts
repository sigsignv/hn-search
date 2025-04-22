import { describe, expect, it } from "vitest";
import { searchByRelevance } from "../src/index.ts";

describe("search", () => {
  it("first test", async () => {
    const response = await searchByRelevance({
      query: "test",
    });
    expect(response).toBeDefined();
  });
});
