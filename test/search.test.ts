import { describe, it } from "vitest";
import { searchByDate, searchByRelevance } from "../src/search.js";
import { authorTag } from "../src/tag.ts";

function createMockResponse() {
  return new Response(
    JSON.stringify({
      hits: [],
      hitsPerPage: 20,
      nbHits: 0,
      nbPages: 0,
      page: 0,
      params: "advancedSyntax=true&analyticsTags=backend",
      query: "",
    }),
  );
}

function createUrl(input: RequestInfo | URL): URL {
  return new URL(input instanceof Request ? input.url : input);
}

describe("searchByDate", () => {
  it("calls correct endpoint", async ({ expect }) => {
    searchByDate({
      client: async (input) => {
        const url = createUrl(input);
        expect(url.protocol).toBe("https:");
        expect(url.host).toBe("hn.algolia.com");
        expect(url.pathname).toBe("/api/v1/search_by_date");
        return createMockResponse();
      },
    });
  });

  it("throws an error when the response is not valid JSON", async ({ expect }) => {
    const task = searchByDate({
      client: async () => new Response("invalid JSON response"),
    });
    await expect(task).rejects.toThrowError(SyntaxError);
    await expect(task).rejects.toThrowError(/is not valid JSON$/);
  });

  it("Should include the query parameter in the request URL", async ({ expect }) => {
    searchByDate({
      query: "example",
      client: async (input) => {
        const url = createUrl(input);
        expect(url.search).toContain("query=example");
        return createMockResponse();
      },
    });
  });

  it("Should include the tags parameter in the request URL", async ({ expect }) => {
    searchByDate({
      tags: ["story"],
      client: async (input) => {
        const url = createUrl(input);
        expect(url.searchParams.get("tags")).toBe("story");
        return createMockResponse();
      },
    });
  });

  it("Should include the tags parameter with multiple values in the request URL", async ({
    expect,
  }) => {
    searchByDate({
      tags: ["story", authorTag("dang")],
      client: async (input) => {
        const url = createUrl(input);
        expect(url.searchParams.get("tags")).toBe("story,author_dang");
        return createMockResponse();
      },
    });
  });

  it("Should include the filters parameter in the request URL", async ({ expect }) => {
    searchByDate({
      filters: [
        { field: "created_at_i", operator: "<", value: 1700000000 },
        { field: "points", operator: ">", value: 100 },
      ],
      client: async (input) => {
        const url = createUrl(input);
        expect(url.searchParams.get("numericFilters")).toBe("created_at_i<1700000000,points>100");
        return createMockResponse();
      },
    });
  });
});

describe("searchByRelevance", () => {
  it("calls correct endpoint", async ({ expect }) => {
    searchByRelevance({
      client: async (input) => {
        const url = createUrl(input);
        expect(url.protocol).toBe("https:");
        expect(url.host).toBe("hn.algolia.com");
        expect(url.pathname).toBe("/api/v1/search");
        return createMockResponse();
      },
    });
  });
});
