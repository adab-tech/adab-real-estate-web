# Deployment — Adab Real Estate Web

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
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server inquiry inserts |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Sitemap, OG tags, JSON-LD |

When Supabase is connected and `properties` is seeded, the site reads listings from the database. If Supabase is unavailable, it falls back to static seed data in `src/data/properties.ts`.

---

## 2. Vercel (hosting)

### First deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `adab-tech/adab-real-estate-web`
3. Framework preset: **Next.js** (auto-detected)
4. Add all environment variables from `.env.example`
5. Deploy

### CLI deploy (optional)

```bash
npm i -g vercel
vercel login
cd adab-real-estate-web
vercel link
vercel env pull .env.local
vercel --prod
```

---

## 3. Custom domain — adabrealestate.ng

### Register the domain

Purchase `.ng` or `.com.ng` from a NiRA-accredited registrar (e.g. Whogohost, RegisterAM).

### Connect to Vercel

1. Vercel project → **Settings** → **Domains**
2. Add `adabrealestate.ng` and `www.adabrealestate.ng`
3. At your registrar, add DNS records Vercel provides:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Wait for SSL provisioning (usually minutes)
5. Set `NEXT_PUBLIC_SITE_URL=https://adabrealestate.ng` in Vercel env vars
6. Redeploy

---

## 4. Post-deploy checklist

- [ ] Homepage loads with featured properties
- [ ] `/properties` search filters work
- [ ] Property detail maps render
- [ ] Contact form saves to `inquiries` table
- [ ] `/sitemap.xml` and `/robots.txt` accessible
- [ ] WhatsApp link opens with correct number
- [ ] Update phone/email in `src/lib/site-config.ts` and redeploy

---

## 5. Managing content (CMS)

See [CMS.md](./CMS.md) for editing listings in Supabase Table Editor.
