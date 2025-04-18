import { describe, expect, it } from "vitest";
import { search } from "../src/index.ts";

describe("search", () => {
  it("first test", async () => {
    const options = { query: "hackernews" };
    const response = await search(options);
    expect(response.ok).toBe(true);
  });
});
