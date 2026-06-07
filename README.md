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

1. **Done** — Scaffold, brand theme, layout shell
2. **Done** — Property listings, detail pages, inquiry forms → Supabase
3. **Done** — Search filters, Google Maps, structured data, sitemap, Vercel config
4. **Done** — Supabase CMS, services pages, deployment docs
5. **Next** — Production deploy + live Supabase keys + custom domain

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` → `.env.local` and add your keys
4. Restart `npm run dev` — inquiry forms will persist to `inquiries`

### Deploy to Vercel

1. Push repo to GitHub (already at `adab-tech/adab-real-estate-web`)
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables from `.env.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain
5. Deploy — Vercel auto-detects Next.js

SEO routes: `/sitemap.xml`, `/robots.txt`

### CMS & deployment guides

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel, Supabase, custom domain
- [docs/CMS.md](docs/CMS.md) — Manage listings in Supabase Table Editor

## Configuration

Edit contact details in `src/lib/site-config.ts` before deploying.
