# hn-search

A JavaScript client to search Hacker News content using the hn.algolia.com API.

## Install

```bash
npm install @sigsign/hn-search
```

## Usage

```typescript
import { hnSearch } from "@sigsign/hn-search";

const result = await hnSearch({
  query: "example",
  tags: ["story"],
  sort: "date",
  filters: [
    ["points", ">", 100],
  ],
});
```

## Author

- Sigsign <<sig@signote.cc>>

## License

MIT
