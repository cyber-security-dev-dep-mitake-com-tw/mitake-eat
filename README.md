# Mitake Eat

A location-based restaurant discovery app built with Next.js. Find the perfect place to eat based on location, budget, food preferences, and more.

## Features

- **Location-based search** — uses browser geolocation to find restaurants near you
- **Flexible budget options** — set budget per person or total, with participant count
- **Food type selection** — choose from predefined tags or add custom keywords
- **Date & time input** — optional, for filtering by opening hours
- **Adjustable result count** — get 3–30 recommendations
- **Map integration** — view results on Google Maps (requires API key)
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

### Run (Demo Mode)

No API key needed — works out of the box with 25 built-in Taipei restaurants.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run (With Google Maps)

1. Create a Google Cloud project and enable **Places API** + **Maps JavaScript API**
2. Create an API key and restrict it to your domain's HTTP referrers
3. Create `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

4. Restart the dev server

### Build

```bash
npm run build
```

## Tech Stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- TypeScript
- TailwindCSS
- [next-intl](https://next-intl-docs.vercel.app/) (i18n)
- Google Maps JavaScript API + Places Library
- Deploy-ready on [Vercel](https://vercel.com) and [GitHub Pages](https://pages.github.com)

## Deploy

### Vercel (Recommended)

Push to GitHub, import the repo on [Vercel](https://vercel.com/new), and set the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable.

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
├── lib/                      # types, constants, demo data, Google Maps loader
├── i18n/                     # next-intl routing
└── middleware.ts             # Locale routing middleware
messages/                     # zh-TW.json, en.json
```

## License

MIT
