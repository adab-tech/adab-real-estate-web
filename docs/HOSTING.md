# Deploy to HOSTAFRICA / DomainKing (static hosting)

The site is built as a **static export** — upload the `out/` folder to `public_html`.

## 1. Build locally

```bash
npm run build
```

Output: `out/` (HTML, CSS, JS, images, `.htaccess`).

## 2. Remove WordPress (if still present)

In DirectAdmin **File Manager** → `domains/adab.ng/public_html`:

- Delete the `wp/` folder
- Remove leftover `index.php` from WordPress if not needed

## 3. Upload site files

Upload **everything inside** `out/` into `public_html` (not the `out` folder itself):

| Local | Hosting |
|-------|---------|
| `out/index.html` | `public_html/index.html` |
| `out/_next/` | `public_html/_next/` |
| `out/brand/` | `public_html/brand/` |
| `out/properties/` | `public_html/properties/` |
| `out/.htaccess` | `public_html/.htaccess` |

Use **File Manager**, **FTP**, or zip → upload → extract.

## 4. DNS (DomainKing or DirectAdmin)

Point the domain to your server (not Vercel):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `102.209.117.119` |
| A | `www` | `102.209.117.119` |

Remove Vercel records (`76.76.21.21`, `cname.vercel-dns.com`).

## 5. SSL

Enable **Let's Encrypt** / **AutoSSL** for `adab.ng` in the hosting panel.

## 6. Updates

After code changes:

```bash
npm run build
```

Re-upload the `out/` folder contents.

## Notes

- Contact forms open **WhatsApp** (no server/database required on hosting).
- Listings use built-in seed data (`src/data/properties.ts`).
- Vercel is optional backup — keep domains removed from Vercel while using hosting.
