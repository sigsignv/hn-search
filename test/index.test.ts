import { describe, expect, it, vi } from "vitest";
import { search } from "../src/index.ts";

describe("search", () => {
  it("first test", async () => {
    const options = { query: "hackernews" };
    const response = await search(options);
    expect(response.ok).toBe(true);
  });
});
