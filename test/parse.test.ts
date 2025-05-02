import { beforeAll, describe, expect, it } from "vitest";
import { parse } from "../src/parse.ts";

describe("parse() with actual search API Response data", () => {
  let response: Response;

  beforeAll(async () => {
    response = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page");
  });

  it("should parse the response correctly", async () => {
    const data = await response.json();
    const obj = parse(data);
    expect(obj).toBeDefined();
  });
});
