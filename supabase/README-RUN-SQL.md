# How to run Supabase SQL scripts

All scripts for **adab.ng** live in this folder (`supabase/`). Open the [Supabase SQL Editor](https://supabase.com/dashboard) for your project, paste each script, and run it.

For Vercel env vars and smoke tests after SQL, see [docs/USER-NEXT-STEPS.md](../docs/USER-NEXT-STEPS.md).

---

## Fresh Supabase project

Run in this order:

| # | File | Purpose |
|---|------|---------|
| 1 | `schema.sql` | Core tables (properties, inquiries, profiles) |
| 2 | `seed.sql` | Sample data (optional) |
| 3 | `portal-schema.sql` | Lister portal tables |
| 4 | `cms-posts.sql` | Blog / CMS posts |
| 5 | `tenant-portal.sql` | Tenant applications, rent payments |
| 6 | `analytics.sql` | Page view analytics for `/admin/analytics` |
| 7 | `seed-admin.sql` | Promote `hello@adab.ng` to admin **after** that user registers |

Shortcut: `setup-all.sql` chains the main fresh-project scripts (check its header before running).

---

## Existing or upgraded project

| # | File | When to run |
|---|------|-------------|
| 1 | `fix-all.sql` | One-time schema upgrade / drift repair |
| 2 | `tenant-portal.sql` | PM / rent tables missing |
| 3 | `analytics.sql` | `/admin/analytics` empty or table missing |
| 4 | **`fix-admin-approve-actions.sql`** | **Approve/reject does not persist** |
| 5 | `fix-missing-profiles.sql` | Users exist in Auth but not `profiles` |
| 6 | `fix-is-admin-jwt.sql` | Admin role not reflected in JWT |
| 7 | `grant-full-admin.sql` | `/admin` access denied |
| 8 | `fix-admin-approve-actions.sql` | Listing/PM approve actions fail |
| 9 | `fix-tenant-portal-fk.sql` | Tenant FK constraint errors |
| 10 | `fix-properties-id.sql` | Property ID type mismatches |
| 11 | `fix-published-at.sql` | Published date column issues |
| 12 | `fix-tenant-applications-mismatch.sql` | Application schema drift |
| 13 | `seed-admin.sql` | Promote admin after first signup |

Most `fix-*.sql` files are **idempotent** — safe to re-run.

---

## Auth URL configuration

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://adab.ng`
- **Redirect URLs:**
  - `https://adab.ng/auth/callback`
  - `https://adab.ng/portal/verify-email`
  - `http://localhost:3000/auth/callback` (local dev)

---

## After running SQL

1. Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel (needed for analytics inserts, webhooks, admin writes).
2. Redeploy production or wait for the next Git deploy.
3. Smoke test: [docs/USER-NEXT-STEPS.md §3](../docs/USER-NEXT-STEPS.md#3-smoke-tests-at-adabng).

---

## Reference copy (adab-ng-site)

SQL is also mirrored to `adab-ng-site/supabase/` for local reference. **Deploy source of truth** is this repo (`adab-real-estate-web/supabase/`).
