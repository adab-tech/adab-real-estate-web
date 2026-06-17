# Vercel Student Developer Pack Setup for adab.ng

This guide covers claiming GitHub Student Developer Pack benefits for Vercel and enabling the tools shipped with this project.

## GitHub Student Developer Pack → Vercel Pro

1. Go to [education.github.com/pack](https://education.github.com/pack) and verify your student status.
2. Find **Vercel** in the pack offers and claim the credit (typically **$50–100** or several months of **Pro**).
3. In [vercel.com/dashboard](https://vercel.com/dashboard), open **Settings → Billing** and confirm the credit or Pro plan is active.
4. Link the same GitHub account used for the Student Pack so deploys stay connected to this repo.

### Hobby vs Pro (with student credit)

| Feature | Hobby | Pro (student credit) |
| --- | --- | --- |
| Commercial use | Limited | Yes — suitable for adab.ng |
| Analytics data retention | Shorter | Longer |
| Bandwidth / build limits | Lower | Higher |
| Team collaboration | Basic | Full team features |
| Preview deployments | Yes | Yes, with more controls |

## What Vercel provides out of the box

- **Auto deploy** from GitHub (`master` → production at [adab.ng](https://adab.ng))
- **Preview URLs** for every pull request
- **SSL** on custom domains
- **Edge network** for fast Nigerian and global visitors

## Dashboard steps (manual)

Complete these after deploy:

### 1. Enable Speed Insights

1. Open the **adab-real-estate-web** project in Vercel.
2. Go to **Analytics → Speed Insights**.
3. Click **Enable** for the production domain (`adab.ng`).
4. The app already includes `<SpeedInsights />` in the root layout — data appears after traffic.

### 2. Enable Web Analytics (optional)

1. Go to **Analytics → Web Analytics**.
2. Enable for production if you want Vercel’s first-party analytics alongside the built-in `<Analytics />` component.

### 3. Preview deployment protection & comments

1. Go to **Settings → Deployment Protection**.
2. Enable protection for preview deployments if you want password or Vercel Authentication on staging URLs.
3. Under **Comments**, enable **Vercel Comments** on preview deployments for design review.

### 4. Environment variables

Confirm these are set under **Settings → Environment Variables** for Production (and Preview if needed):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (`https://adab.ng`) for OG images and metadata |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase access |
| Payment / AI keys | As required by enabled features |

Redeploy after adding or changing variables.

## Dynamic OG images

Property and lister pages use a dynamic Open Graph image API:

```
https://adab.ng/api/og/property?title=Test&price=₦50M&location=Abuja
```

Optional `image` query param adds a property photo as background:

```
https://adab.ng/api/og/property?title=3-Bed%20Duplex&price=₦85M&location=Maitama%2C%20Abuja&image=https%3A%2F%2F...
```

Test in [opengraph.xyz](https://www.opengraph.xyz/) or share a property link on WhatsApp to verify previews.

## Deploy commands

```bash
npm run build
npx vercel deploy --prod --yes --scope adab-techs-projects
```

Production domain: **https://adab.ng**
