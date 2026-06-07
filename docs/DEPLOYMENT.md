# Deployment — Adab Real Estate Web

**Production domain:** [https://adab.ng](https://adab.ng)  
**Live app host:** Vercel (`adab-real-estate-web`)

---

## 1. Supabase (database + CMS)

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run, in order:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
3. Copy **Project URL** and **anon key** from Settings → API
4. Optional: copy **service_role** key for server-side writes

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://adab.ng` — sitemap, OG, JSON-LD |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server inquiry inserts |

When Supabase is connected and `properties` is seeded, the site reads listings from the database. If Supabase is unavailable, it falls back to static seed data in `src/data/properties.ts`.

---

## 2. Vercel (website hosting)

1. Import `adab-tech/adab-real-estate-web` at [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (auto-detected)
3. Add environment variables from `.env.example`
4. Deploy

The website does **not** run on traditional shared hosting — only DNS (and optionally email MX) uses your **adab.ng** package.

---

## 3. Custom domain — adab.ng

**Full guide:** [DOMAIN.md](./DOMAIN.md)

Quick steps:

1. Vercel → **Settings** → **Domains** → add `adab.ng` and `www.adab.ng`
2. At your registrar, set DNS:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

3. Set `NEXT_PUBLIC_SITE_URL=https://adab.ng` in Vercel
4. Redeploy after DNS validates

---

## 4. Post-deploy checklist

- [ ] https://adab.ng loads with featured properties
- [ ] `/properties` search filters work
- [ ] Property detail maps render
- [ ] Contact form saves to `inquiries` table (if Supabase connected)
- [ ] `/sitemap.xml` lists `adab.ng` URLs
- [ ] WhatsApp opens **+234 812 827 2287**

---

## 5. Managing content (CMS)

See [CMS.md](./CMS.md) for editing listings in Supabase Table Editor.
