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

Places live in `data/places.json` (336 entries). Each entry has `id`, `name`, `category`, `province`, `lng`, `lat`, `summary` and `verified`.

- The first 132 entries (`verified: true`) are summaries compiled from official sources (kulturportali.gov.tr, ktb.gov.tr, muze.gov.tr, unesco.org.tr, whc.unesco.org).
- The rest (`verified: false`) were collected later, mostly from Wikipedia, Wikidata and OpenStreetMap. Their summaries and coordinates still need checking against official sources. Some pins sit at a village or district centre rather than the site itself.
- Coverage is uneven: several provinces (for example Hakkâri, Bingöl, Sakarya) are thin. Corrections and additions are welcome.

To add a place, append an entry with the next free `id`, then run `bun run check`. Coordinates are decimal degrees (`lng` east-west, `lat` north-south).

Your visited places are stored only in your browser's `localStorage`.

## Search

The search box ignores accents and case (`sanliurfa` finds Şanlıurfa), matches several words at once across name, province and category, ranks name matches first and tolerates a single typo. Press `/` to focus it.

## Workflow

`bun install` sets up a pre-commit hook (`.githooks/pre-commit`) that validates `data/places.json` (`bun run validate`: known category, unique id and name, coordinates inside Türkiye) and runs Biome format and lint on staged files. Every push to `main` is deployed to Vercel automatically.

## License

[MIT](LICENSE). Map data © OpenStreetMap contributors, tiles by OpenFreeMap.
