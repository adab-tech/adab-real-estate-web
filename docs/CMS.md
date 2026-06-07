# CMS Guide — Managing Listings in Supabase

Adab uses **Supabase Table Editor** as the property CMS. No separate admin panel is required for v1.

## Access

1. Log in to [supabase.com](https://supabase.com)
2. Open your project → **Table Editor** → `properties`

## Adding a listing

| Column | Example | Notes |
|--------|---------|-------|
| `id` | `prop-009` | Unique text ID |
| `slug` | `2-bed-flat-ikeja` | URL-safe, used in `/properties/[slug]` |
| `title` | `2-Bedroom Flat in Ikeja` | Display title |
| `description` | Full paragraph | Shown on detail page |
| `type` | `sale` or `rent` | |
| `category` | `apartment`, `house`, `duplex`, `land`, `commercial` | |
| `price_ngn` | `45000000` | Integer NGN amount |
| `price_period` | `year` or `month` | Rent only; leave null for sale |
| `location` | JSON (see below) | Must include `lat` and `lng` |
| `beds` / `baths` / `sqm` | Numbers | Optional for land |
| `features` | JSON array | `["Pool", "Security"]` |
| `images` | JSON array | Full image URLs |
| `status` | `available` | Or `under_offer`, `sold`, `rented` |
| `featured` | `true` / `false` | Shows on homepage |
| `published_at` | `2026-06-06` | Date |

### Location JSON example

```json
{
  "city": "Lagos",
  "area": "Ikeja GRA",
  "state": "Lagos",
  "address": "Obafemi Awolowo Way",
  "lat": 6.6018,
  "lng": 3.3515
}
```

## Viewing inquiries

**Table Editor** → `inquiries` — all form submissions from the website.

Columns include `name`, `phone`, `email`, `message`, `property_slug`, and `source` (`contact` or `property_detail`).

## Cache / publish timing

Property pages revalidate every **5 minutes** (`revalidate = 300`). New or edited listings appear on the live site within that window after saving in Supabase.

For immediate updates after urgent edits, trigger a redeploy in Vercel or wait for the revalidation window.

## Images

Upload property photos to:

- Supabase **Storage** (create a `property-images` bucket, public read), or
- Cloudinary / any CDN

Paste the public URLs into the `images` JSON array.

## Fallback data

If the `properties` table is empty or Supabase is down, the site serves listings from `src/data/properties.ts` automatically.
