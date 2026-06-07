# CMS Guide — Managing Listings

Adab has a built-in **admin panel** at `/admin` for managing property listings. Supabase remains the database; the admin UI is the recommended way to add and edit listings.

## Quick start

1. Run `supabase/admin-setup.sql` once in the Supabase SQL Editor (policies + image storage).
2. In Supabase → **Authentication** → **Users** → **Add user** (your email + password).
3. Open the user → **Raw App Meta Data** → set: `{ "role": "admin" }`
4. Go to [https://adab.ng/admin/login](https://adab.ng/admin/login) and sign in.

## Admin panel

| URL | Purpose |
|-----|---------|
| `/admin/login` | Sign in |
| `/admin/properties` | List all listings |
| `/admin/properties/new` | Add a listing |
| `/admin/properties/[id]/edit` | Edit or delete a listing |
| `/admin/inquiries` | View recent leads |

After saving, the live site refreshes **immediately** (no 5-minute wait).

## Listing fields

| Field | Notes |
|-------|-------|
| **Title** | Name shown on the site |
| **URL slug** | Auto-generated from title; used in `/properties/[slug]` |
| **Description** | Full text on the detail page |
| **Type** | `sale` or `rent` |
| **Category** | apartment, house, duplex, land, commercial |
| **Price (NGN)** | Integer amount |
| **Rent period** | year or month (rent only) |
| **Location** | City, area, state, optional address, lat/lng |
| **Features** | One per line |
| **Images** | Upload via the form, or paste URLs one per line |
| **Status** | available, under_offer, sold, rented |
| **Featured** | Shows on homepage when available |
| **Published date** | Controls sort order on `/properties` |

## Images

Upload photos in the admin form (stored in Supabase **property-images** bucket), or paste external URLs (e.g. Unsplash).

## Fallback (advanced)

If the `properties` table is empty or Supabase is unavailable, the public site falls back to `src/data/properties.ts`.

## Legacy: Supabase Table Editor

You can still edit rows directly in Supabase **Table Editor** → `properties`, but the admin panel is easier and triggers instant site refresh.
