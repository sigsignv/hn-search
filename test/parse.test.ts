import { beforeAll, describe, expect, it } from "vitest";
import { search } from "../src/index.ts";
import { parse } from "../src/parse.ts";

describe("parse() with actual search API Response data", () => {
  let response: Response;

  beforeAll(async () => {
    response = await search({
      query: "hackernews",
    });
  });

  it("should parse the response correctly", async () => {
    const data = await response.json();
    const obj = parse(data);
    expect(obj).toBeDefined();
  });
});
