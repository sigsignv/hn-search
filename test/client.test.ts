import { describe, it } from "vitest";
import type { HttpClient } from "../src/client.ts";

describe("HttpClient", () => {
  it("should be able to create a client", async ({ expect }) => {
    const src = { kind: "ok" };
    const client: HttpClient = async () => {
      return new Response(JSON.stringify(src), {
        headers: { "Content-Type": "application/json" },
      });
    };
    const response = await client("https://example.com/");
    const dest = await response.json();
    expect(dest).toEqual(src);
  });
});
