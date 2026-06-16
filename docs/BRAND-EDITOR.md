# Brand template editor

Staff customize Adab marketing templates at **`/admin/brand/editor`** (requires admin login).

## What you can do

1. **Pick a template** — property promo, Instagram post/story, WhatsApp status (9:16), LinkedIn post/cover, email signature, letterhead, business card, A5 flyer, A4 property flyer.
2. **Fill fields** — title, subtitle, ₦ price, location, description, agent contact, CTA link (listing URL, `adab.ng`, or `wa.me/…`).
3. **Add a photo** — upload to Supabase (`brand-assets` bucket), paste an image URL, or **Load from listing** to pull a published property.
4. **Save drafts** — stored in `brand_template_drafts` per admin user; load, duplicate, or delete from **My saved templates**.
5. **Export & share**
   - **Download PNG** — platform dimensions via html2canvas.
   - **Copy image** — clipboard where the browser supports it.
   - **Open printable HTML** — new tab for print/PDF.
   - **WhatsApp** — download PNG for Status; use **Share text via WhatsApp** for listing copy + link.
   - **Instagram** — download PNG, then upload in the Instagram app (no direct API).
   - **LinkedIn** — download PNG or use **Share on LinkedIn** for link posts.

Static defaults remain in `public/brand/downloads/` (office + promo HTML, Word corporate kit).

## Brand colors

| Name | Hex |
|------|-----|
| Adab Navy | `#1B2A4A` |
| Adab Gold | `#C9A227` |
| Adab Cream | `#F8F6F1` |

## Supabase setup (one-time)

Run in the SQL Editor (after `is_admin()` exists):

1. `supabase/brand-assets-storage.sql` — `brand-assets` bucket, admin-only write, public read.
2. `supabase/brand-template-drafts.sql` — `brand_template_drafts` table + RLS.

## Environment

Uses existing Supabase env vars (same as admin panel):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No new env vars. If storage is not configured, photo upload falls back to a local blob preview (export still works in-session).

## Corporate Word kit

Download from **Brand assets → Corporate kit (Word)**:

- `corporate-profile.doc`
- `property-listing-sheet.doc`
- `tenant-application-form.doc`

Files live under `public/brand/downloads/office/word/`.

## Tips (Nigeria)

- Always show prices in **₦** (Naira).
- **WhatsApp Status** is 9:16 — use the WhatsApp status template, download PNG, then add from gallery.
- For diaspora buyers, include **adab.ng listing link** in CTA and WhatsApp share text.
