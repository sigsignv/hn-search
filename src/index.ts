export type SearchOptions = {
  query: string;
};

export async function search(options: SearchOptions) {
  const { query } = options;
  const url = new URL("http://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("hitsPerPage", "10");

  return await fetch(url);
}
