export type HackerNewsFilter = {
  field: "created_at_i" | "points" | "num_comments";
  operator: "<" | "<=" | "=" | ">" | ">=";
  value: number;
};

export function buildFilterParam(filters: HackerNewsFilter[]): string {
  const params = [];
  for (const filter of filters) {
    const { field, operator, value } = filter;
    params.push(`${field}${operator}${value}`);
  }
  return params.join(",");
}
