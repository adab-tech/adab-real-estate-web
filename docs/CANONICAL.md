# Canonical deploy target

**adab.ng is deployed from this repository only:**

| Item | Value |
|------|-------|
| Repo | [github.com/adab-tech/adab-real-estate-web](https://github.com/adab-tech/adab-real-estate-web) |
| Vercel | [adab-real-estate-web.vercel.app](https://adab-real-estate-web.vercel.app) |
| Domain | [adab.ng](https://adab.ng) |

## Not the deploy target

The sibling folder `adab-ng-site` (static HTML export) is **not** connected to Vercel or the production domain. It may be used for local previews or legacy hosting experiments, but all production changes must land in **adab-real-estate-web**.

## Portal vs admin

| Route | Purpose |
|-------|---------|
| `/portal` | Lister portal — owners, landlords, agencies submit listings |
| `/admin` | Adab staff CMS — separate auth and UI |

Run `supabase/portal-schema.sql` in Supabase after the base `schema.sql` to enable the lister portal.
