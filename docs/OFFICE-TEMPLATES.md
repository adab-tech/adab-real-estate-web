# Office & promotional HTML templates

Staff-facing print and social templates live in two places:

| Location | Use |
|----------|-----|
| `public/brand/downloads/office/` | Business card, email signature, letterhead, property flyer (print/office) |
| `public/brand/downloads/promo/` | Social HTML — open in browser, edit placeholders, screenshot or Print / Save PDF |

Admin **Brand assets** lists downloads via `src/lib/brand-assets.ts` (`officeTemplates`, `promoTemplates`).

## Office templates

- **business-card.html** — 90×50mm card; replace name, title, phone, email.
- **email-signature.html** — Copy HTML block into Outlook/Gmail signature settings.
- **letterhead.html** — A4 correspondence; edit body and date before print.

## Promo templates (`public/brand/downloads/promo/`)

- **instagram-post.html** — 1080×1080 square for Instagram/Facebook feed posts.
- **instagram-story.html** — 1080×1920 vertical for Instagram/Facebook Stories.
- **whatsapp-property-status.html** — 9:16 status graphic for WhatsApp Status.

## Workflow

1. Open the file from admin **Brand assets** links or at `https://adab.ng/brand/downloads/promo/<file>.html`.
2. Click editable fields (where marked) or edit HTML for photos and prices.
3. Use the toolbar **Print / Save PDF** or screenshot for social sizes.
4. Property flyer (detailed A4 listing) remains under **Office** at `public/brand/downloads/office/property-flyer.html`.

## Brand rules

Navy `#1B2A4A`, gold `#C9A227`, cream `#F8F6F1`. Logo from `/brand/logo.png`. CAC line on customer-facing print: RC 9590252.
