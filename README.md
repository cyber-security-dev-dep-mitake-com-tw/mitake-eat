# Mitake Eat

A location-based restaurant discovery app built with Next.js. Find the perfect place to eat based on location, budget, food preferences, and more.

## Features

- **Location-based search** — uses browser geolocation to find restaurants near you
- **Flexible budget options** — set budget per person or total, with participant count
- **Food type selection** — choose from predefined tags or add custom keywords
- **Date & time input** — optional, for filtering by opening hours
- **Adjustable result count** — get 3–30 recommendations
- **Map integration** — view results on an interactive map (Leaflet + OpenStreetMap, no API key needed)
- **Filter & sort** — refine by price level, rating, distance, and food type; sort by rating, distance, or price
- **i18n support** — Traditional Chinese (default) and English

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No API keys required. Restaurant data comes from [OpenStreetMap](https://www.openstreetmap.org/) via the [Overpass API](https://overpass-api.de/), and maps are rendered with [Leaflet](https://leafletjs.com/) using free OpenStreetMap tiles.

### Build

```bash
npm run build
```

## Tech Stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- TypeScript
- TailwindCSS
- [next-intl](https://next-intl-docs.vercel.app/) (i18n)
- [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) (maps)
- [Overpass API](https://overpass-api.de/) (restaurant data)
- Deploy-ready on [Vercel](https://vercel.com) and [GitHub Pages](https://pages.github.com)

## Deploy

### Vercel (Recommended)

Push to GitHub, import the repo on [Vercel](https://vercel.com/new). No environment variables needed.

### GitHub Pages

The repo includes a [GitHub Actions workflow](.github/workflows/deploy.yml) that builds and deploys to GitHub Pages automatically on every push to `main`.

1. Go to your repo **Settings → Pages** and set **Source** to **GitHub Actions**
2. Push to `main` — the workflow handles the rest

The site will be available at `https://<org>.github.io/mitake-eat/`.

> **Note:** The GitHub Pages build removes the locale middleware for static export. Locale routing is handled entirely via path segments (`/zh-TW/`, `/en/`); root `/` redirects to the default locale.

## Project Structure

```
src/
├── app/[locale]/page.tsx    # Home page with search form + results view
├── components/               # UI components
├── hooks/                    # use-geolocation, use-restaurants
├── lib/                      # types, constants, demo data, Overpass API wrapper
├── i18n/                     # next-intl routing
└── middleware.ts             # Locale routing middleware
messages/                     # zh-TW.json, en.json
```

## License

MIT
