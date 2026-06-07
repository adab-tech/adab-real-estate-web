# Custom domain — adab.ng

Your Next.js site runs on **Vercel**. The domain **adab.ng** (and optional hosting/email from your registrar) connects via DNS — you do not need to upload files to traditional hosting for the website.

## Architecture

| Service | Role |
|---------|------|
| **Vercel** | Hosts the Next.js website (fast, SSL, deploys from GitHub) |
| **adab.ng DNS** | Points visitors to Vercel |
| **Hosting package** (optional) | Use for **email** (`hello@adab.ng`) or leave unused if Vercel serves the site |

---

## Step 1 — Add domain in Vercel

1. Open [Vercel Dashboard](https://vercel.com) → project **adab-real-estate-web**
2. **Settings** → **Domains**
3. Add:
   - `adab.ng`
   - `www.adab.ng`
4. Vercel will show required DNS records (keep this tab open)

---

## Step 2 — DNS at your registrar / hosting panel

Log in where you manage **adab.ng** (NiRA registrar or hosting control panel).

### Option A — A + CNAME (most common)

| Type | Host / Name | Value | TTL |
|------|-------------|-------|-----|
| **A** | `@` (or blank) | `76.76.21.21` | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

### Option B — Vercel nameservers (if registrar allows)

Replace nameservers with the ones Vercel provides in the Domains screen. Vercel then manages all DNS.

### Remove conflicts

Delete old **A**, **CNAME**, or **parking** records for `@` and `www` that point elsewhere, or the site will not resolve to Vercel.

---

## Step 3 — Environment variable

In Vercel → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://adab.ng
```

Apply to **Production**, then **Redeploy**.

---

## Step 4 — SSL & verification

- SSL certificates issue automatically (usually 5–30 minutes after DNS propagates)
- Vercel Domains page should show **Valid** for both `adab.ng` and `www.adab.ng`
- `www.adab.ng` redirects to `https://adab.ng` (configured in `next.config.ts`)

Check propagation: [dnschecker.org](https://dnschecker.org/#A/adab.ng)

---

## Step 5 — Email on your hosting package (optional)

To use **hello@adab.ng** for real mail:

1. In your hosting/cPanel → **Email Accounts** → create `hello@adab.ng`
2. Ensure **MX records** for `adab.ng` point to your host (not Vercel)
3. MX and website DNS can coexist:
   - **A** `@` → `76.76.21.21` (website → Vercel)
   - **MX** `@` → mail server from your host (email)

If your host requires their nameservers for email, ask support how to split **web** (Vercel) vs **mail** (hosting).

---

## Step 6 — Post-go-live checklist

- [ ] https://adab.ng loads the homepage
- [ ] https://www.adab.ng redirects to https://adab.ng
- [ ] `/properties`, `/contact`, `/sitemap.xml` work on adab.ng
- [ ] Phone **+234 812 827 2287** and WhatsApp links work
- [ ] Google Search Console: add property `https://adab.ng`
- [ ] Update WhatsApp Business / social bios with `https://adab.ng`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Domain shows parking page | Remove registrar parking; set A record to Vercel |
| SSL pending | Wait for DNS; ensure A/CNAME match Vercel exactly |
| www works but apex does not | Add **A** record `@` → `76.76.21.21` |
| Email stops working | Do not remove MX records; only change A/CNAME for web |

Support: Vercel [custom domains docs](https://vercel.com/docs/domains)
