import { describe, expect, it } from "vitest";
import type { Transport } from "../src/transport.ts";

function createFakeTransport(response: Response): Transport {
  return async () => response;
}

describe("transport", () => {
  it("should be able to create a transport", async () => {
    const src = { kind: "ok" };
    const transport = createFakeTransport(
      new Response(JSON.stringify(src), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await transport({ url: new URL("https://example.com") });
    const dest = await response.json();
    expect(dest).toEqual(src);
  });
});
