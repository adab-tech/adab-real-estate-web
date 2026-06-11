# Deployment — Adab Real Estate Web

**Production domain:** [https://adab.ng](https://adab.ng)  
**Canonical repo:** [adab-tech/adab-real-estate-web](https://github.com/adab-tech/adab-real-estate-web)  
**Vercel project:** [adab-real-estate-web.vercel.app](https://adab-real-estate-web.vercel.app)

> The static export folder `adab-ng-site` is **not** the deploy target. See [CANONICAL.md](./CANONICAL.md).

---

## 1. Supabase (database + CMS)

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run scripts in this order:

   | Order | Script | When |
   |-------|--------|------|
   | 1 | `supabase/schema.sql` | Fresh project only |
   | 2 | `supabase/seed.sql` | Fresh project only |
   | 3 | `supabase/portal-schema.sql` | Fresh project (lister portal) |
   | — | **`supabase/fix-all.sql`** | **Existing project** — upgrades legacy tables, RLS, storage (run once instead of 1–3 if upgrading) |
   | 4 | `supabase/cms-posts.sql` | Posts / announcements CMS |
   | 5 | `supabase/tenant-portal.sql` | Tenant portal, PM tables, rent payments |
   | 6 | `supabase/analytics.sql` | Anonymous page-view analytics (`/admin/analytics`) |
   | 7 | `supabase/seed-admin.sql` | After `hello@adab.ng` registers — promotes to admin |
   | 8 | `supabase/grant-full-admin.sql` | If `/admin` or JWT admin checks fail |

   **Fix scripts** (run only when needed):

   | Script | Purpose |
   |--------|---------|
   | `fix-properties-id.sql` | Listing save / UUID id errors |
   | `fix-tenant-portal-fk.sql` | Tenant PM foreign-key mismatches |
   | `fix-tenant-applications-mismatch.sql` | `pm_applications` schema drift |
   | `fix-missing-profiles.sql` | Backfill profiles for auth users (FK on applications) |
   | `fix-is-admin-jwt.sql` | Admins cannot see pending listings |
   | `fix-published-at.sql` | Missing `published_at` on approved listings |
3. Copy **Project URL** and **anon key** from Settings → API
4. Optional: copy **service_role** key for server-side writes
5. After the first admin registers via `/portal/register` and confirms email, run **`supabase/seed-admin.sql`** once to promote `hello@adab.ng` (or edit the email in that file first).

### Supabase Auth redirect URLs

In Supabase → **Authentication** → **URL Configuration**, set:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://adab.ng` |
| **Redirect URLs** (add each) | `https://adab.ng/auth/callback` |
| | `https://adab.ng/portal/verify-email` |
| | `https://adab-real-estate-web.vercel.app/auth/callback` (preview) |
| | `http://localhost:3000/auth/callback` (local dev) |

Email confirmation links use `/auth/callback?next=/portal/dashboard`. The callback route handles both `code` (PKCE) and `token_hash` + `type=signup` (magic link) flows.

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://adab.ng` — sitemap, OG, JSON-LD |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server inquiry inserts |
| `PAYSTACK_SECRET_KEY` | Optional | Paystack server API + webhook signature |
| `PAYSTACK_PUBLIC_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional | Paystack checkout |
| `FLUTTERWAVE_SECRET_KEY` | Optional | Flutterwave stub (Phase 2) |
| `FLUTTERWAVE_PUBLIC_KEY` / `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Optional | Flutterwave stub (Phase 2) |

When Supabase is connected, the site merges **published** portal listings (`status = published`) with static seed data in `src/data/properties.ts` (database entries win on slug conflicts). Pages revalidate every 60 seconds. If Supabase is unavailable, only the static seed is shown.

---

## 2. Vercel (website hosting)

1. Import `adab-tech/adab-real-estate-web` at [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (auto-detected)
3. Add environment variables from `.env.example`
4. Deploy

For **shared hosting**, run `npm run build` and upload the `out/` folder — see [HOSTING.md](./HOSTING.md). Vercel is optional when you do not use hosting.

### Lister approval emails (Resend)

When an admin publishes a listing from `/portal/admin`, listers receive a confirmation email via [Resend](https://resend.com). Approvals succeed without email configured; content is logged server-side instead.

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes (for send) | Resend API key — required to deliver approval emails |
| `EMAIL_FROM` | Recommended | e.g. `Adab Real Estate <hello@adab.ng>` |

Add both in Vercel → **Settings** → **Environment Variables** (Production). Verify the `adab.ng` sending domain in the Resend dashboard.

**Smoke test:** Approve a listing in `/portal/admin`, then check Vercel function logs for a successful send.

### Zoho CRM (leads & deals)

Property inquiries, tenant applications, and listing approvals sync to Zoho CRM when configured. Submissions succeed without Zoho; CRM errors are logged server-side only.

| Variable | Required | Purpose |
|----------|----------|---------|
| `ZOHO_CLIENT_ID` | Yes (for CRM) | Zoho API Console client ID |
| `ZOHO_CLIENT_SECRET` | Yes (for CRM) | Zoho client secret |
| `ZOHO_REFRESH_TOKEN` | Yes (for CRM) | Long-lived refresh token (CRM scopes) |
| `ZOHO_API_DOMAIN` | Optional | `zoho.com` (default), `zoho.eu`, `zoho.in`, etc. |

Check status at `/admin/settings` after deploy. Full setup guide: [ZOHO-CRM-SETUP.md](./ZOHO-CRM-SETUP.md). Run `supabase/grant-full-admin.sql` if the admin panel is inaccessible.

**Paystack webhook:** `https://adab.ng/api/payments/paystack/webhook` (validates `x-paystack-signature` when `PAYSTACK_SECRET_KEY` is set).

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
- [ ] `/portal/admin` listing approval sends lister email (Vercel logs)
- [ ] `/portal/admin` approval makes listing visible on `/properties` within ~1 minute (cache revalidation)
- [ ] Portal admin promoted via `supabase/seed-admin.sql` (if using `hello@adab.ng`)
- [ ] Admin promoted via `supabase/seed-admin.sql` can access `/portal/admin`
- [ ] Approved portal listing appears on `/properties` within ~60s
- [ ] Email verification works via `/auth/callback` (expired links show friendly resend UI)

---

## 5. Managing content (CMS)

See [CMS.md](./CMS.md) for editing listings in Supabase Table Editor.
