# hn-search

A JavaScript client to search Hacker News content using the hn.algolia.com API.

## Install

```bash
npm install @sigsign/hn-search
```

## Usage

```typescript
import { searchByDate } from "@sigsign/hn-search";

const result = await searchByDate({
  query: "example",
  tags: ["story"],
  filters: [
    { field: "points", operator: ">", value: 100 },
  ],
})
```

## Author

- Sigsign <<sig@signote.cc>>

## License

MIT
