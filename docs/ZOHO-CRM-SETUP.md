# Zoho CRM setup — Adab Real Estate

Sync property inquiries, tenant applications, and listing approvals to Zoho CRM. The site works without Zoho; CRM errors are logged server-side only.

---

## 1. Create a Zoho API client

1. Sign in to [Zoho API Console](https://api-console.zoho.com/).
2. **Add Client** → **Server-based Applications**.
3. Set **Homepage URL** to `https://adab.ng` and **Authorized Redirect URI** to a URL you control (e.g. `https://adab.ng/auth/callback` or a local OAuth helper).
4. Note the **Client ID** and **Client Secret**.

Use the API Console for your data centre (`.com`, `.eu`, `.in`, etc.).

---

## 2. Generate a refresh token

1. Build an authorization URL (replace placeholders):

   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=YOUR_REDIRECT_URI
   ```

   For EU accounts, use `https://accounts.zoho.eu/oauth/v2/auth` instead.

2. Open the URL in a browser, approve access, and copy the `code` from the redirect query string.

3. Exchange the code for tokens:

   ```bash
   curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=YOUR_REDIRECT_URI" \
     -d "code=AUTHORIZATION_CODE"
   ```

4. Save the **refresh_token** from the response. Access tokens expire; the app refreshes them automatically.

---

## 3. Add environment variables (Vercel)

In Vercel → **Settings** → **Environment Variables** (Production):

| Variable | Required | Example |
|----------|----------|---------|
| `ZOHO_CLIENT_ID` | Yes | From API Console |
| `ZOHO_CLIENT_SECRET` | Yes | From API Console |
| `ZOHO_REFRESH_TOKEN` | Yes | From token exchange |
| `ZOHO_API_DOMAIN` | Optional | `zoho.com` (default), `zoho.eu`, `zoho.in` |
| `ZOHO_ACCOUNTS_DOMAIN` | Optional | Override accounts host if needed |

Copy the same values locally into `.env.local` for development.

---

## 4. Verify

1. Deploy or restart the dev server after setting env vars.
2. Open **`/admin/settings`** — Zoho CRM should show **Connected**.
3. Submit a test inquiry or tenant application; check **Leads** in Zoho CRM.
4. Approve a listing from `/admin/listings/pending` or `/portal/admin`; check **Deals** in Zoho CRM.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **Not configured** on settings | All three required vars must be set |
| **Config error** / token failed | Regenerate refresh token; confirm data centre (`ZOHO_API_DOMAIN`) |
| Leads not appearing | Check Vercel function logs for `[zoho]` errors; confirm CRM scopes |
| EU / India account | Set `ZOHO_API_DOMAIN` to `zoho.eu` or `zoho.in` |

If admins cannot access `/admin`, run `supabase/grant-full-admin.sql` in the Supabase SQL Editor.
