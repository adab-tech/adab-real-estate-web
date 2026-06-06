# Adab Real Estate — Web

Next.js website for **Adab Real Estate Agency**, Nigeria.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Brand assets from [`adab-real-estate-agency`](https://github.com/adab-tech/adab-real-estate-agency)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/              # Routes (home, properties, services, about, contact)
├── components/layout/ # Header, Footer, PageHeader
└── lib/site-config.ts # Brand name, nav, contact details
public/brand/         # Logo, favicon, mark (synced from brand repo)
```

## Build phases

1. **Done** — Scaffold, brand theme, layout shell, placeholder pages
2. **Next** — Property data model, listing cards, inquiry forms → Supabase
3. **Later** — CMS, search, maps, SEO, analytics

## Configuration

Edit contact details in `src/lib/site-config.ts` before deploying.
