# Discover Türkiye

Interactive map for exploring ancient cities, monuments, museums, national parks, castles, caravanserais, natural wonders and caves across Türkiye.

## Stack

- [Svelte 5](https://svelte.dev) with TypeScript (checked with TypeScript 7 via `svelte-check --tsgo`)
- [Tailwind CSS 4](https://tailwindcss.com)
- [MapLibre GL JS](https://maplibre.org) with [OpenFreeMap](https://openfreemap.org) tiles
- [Bun](https://bun.sh) for dev server and bundling
- [Biome](https://biomejs.dev) for linting, formatting and Tailwind class sorting

## Setup

```sh
bun install
bun run dev
```

| Script           | Purpose                                 |
| ---------------- | --------------------------------------- |
| `bun run dev`    | Dev server with HMR on `localhost:3000` |
| `bun run build`  | Production build into `dist/`           |
| `bun run check`  | Biome lint and type check               |
| `bun run format` | Apply Biome fixes and formatting        |

## Data

Places live in `data/places.json`. Descriptions are short factual summaries compiled from official sources (kulturportali.gov.tr, ktb.gov.tr, muze.gov.tr, unesco.org.tr, whc.unesco.org). Coordinates of many entries are approximate and being verified.

Your visited places are stored only in your browser's `localStorage`.

## License

[MIT](LICENSE). Map data © OpenStreetMap contributors, tiles by OpenFreeMap.
