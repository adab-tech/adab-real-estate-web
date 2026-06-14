# User next steps — adab.ng

Manual setup after deploy. **No secrets in this file** — add values only in Vercel and Supabase dashboards.

---

## 1. Vercel environment variables

Project: **adab-real-estate-web** → Settings → Environment Variables (Production).

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://adab.ng` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Recommended** | Admin approve/deny, analytics inserts, Paystack webhooks |
| `RESEND_API_KEY` | For emails | Listing approval + application status emails |
| `EMAIL_FROM` | For emails | e.g. `Adab Real Estate <hello@adab.ng>` |
| `PAYSTACK_SECRET_KEY` | For rent pay | Server API + webhook signature |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | For rent pay | Public key (test or live) |
| `ZOHO_CLIENT_ID` | For CRM | Zoho API Console |
| `ZOHO_CLIENT_SECRET` | For CRM | Zoho API Console |
| `ZOHO_REFRESH_TOKEN` | For CRM | CRM scopes — see `docs/ZOHO-CRM-SETUP.md` |
| `ZOHO_API_DOMAIN` | Optional | `zoho.com` (default), `zoho.eu`, etc. |

After adding vars: **Redeploy** production (or trigger a new deploy from the latest `master` commit).

### Paystack webhook (Vercel + Paystack dashboard)

1. Paystack → Settings → **Webhooks**
2. URL: `https://adab.ng/api/payments/paystack/webhook`
3. Events: `charge.success` (minimum)
4. Signature uses `PAYSTACK_SECRET_KEY` — must match the key in Vercel

### Zoho health check

Visit `https://adab.ng/admin/settings` — Zoho row should show **Connected** after OAuth vars are set.

---

## 2. Supabase SQL run order

Open **SQL Editor** in your Supabase project. Scripts live in repo `supabase/`.

### Fresh project

| Order | Script |
|-------|--------|
| 1 | `schema.sql` |
| 2 | `seed.sql` |
| 3 | `portal-schema.sql` |
| 4 | `cms-posts.sql` |
| 5 | `tenant-portal.sql` |
| 6 | `analytics.sql` |
| 7 | `seed-admin.sql` (after `hello@adab.ng` registers) |

### Existing / upgraded project

| Order | Script | When |
|-------|--------|------|
| 1 | `fix-all.sql` | One-time schema upgrade |
| 2 | `tenant-portal.sql` | If PM / rent tables missing |
| 3 | `analytics.sql` | If `/admin/analytics` is empty |
| 4 | **`fix-admin-approve-actions.sql`** | **If approve/reject does not persist** |
| 5 | `grant-full-admin.sql` | If `/admin` access fails |
| 6 | `seed-admin.sql` | Promote admin after first signup |

### Supabase Auth URLs

Authentication → URL Configuration:

- **Site URL:** `https://adab.ng`
- **Redirect URLs:** `https://adab.ng/auth/callback`, `https://adab.ng/portal/verify-email`, `http://localhost:3000/auth/callback`

---

## 3. Smoke tests at adab.ng

| Area | URL / action | Expect |
|------|----------------|--------|
| Integrations | `/admin/settings` | Green badges for configured services |
| Listing approve | `/admin/listings/pending` | Approve removes item + success message |
| PM application | `/admin/pm/applications` | Approve/Reject shows feedback |
| Analytics | Browse `/`, `/properties` then `/admin/analytics` | Views increase (needs `analytics.sql` + service role) |
| Rent pay | Admin creates pending payment → tenant `/tenant/dashboard` → Pay | Paystack checkout → return with success banner |
| Zoho | Submit contact or tenant application | New lead in Zoho CRM (if configured) |

---

## 4. Sync copy to adab-ng-site

If you maintain SQL in `adab-ng-site/supabase/` for reference, copy any changed scripts from `adab-real-estate-web/supabase/` after deploy. Current critical script: `fix-admin-approve-actions.sql`.
