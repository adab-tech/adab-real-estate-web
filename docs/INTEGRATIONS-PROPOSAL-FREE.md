# Integrations (free tier) — live vs optional

Post–`61c7db6` the app ships core integrations in code; most extras are **optional** and controlled by env vars. Admin **Settings → Integrations** reads `src/lib/integrations.ts`.

## Always required (production)

| Integration | Purpose | Env vars |
|-------------|---------|----------|
| **Supabase** | Auth, CMS, inquiries, tenant portal, webhooks | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Supabase service role** | Server writes (inquiries, analytics, payment webhooks, admin actions) | `SUPABASE_SERVICE_ROLE_KEY` |
| **Site URL** | Sitemap, OG, email links, payment callbacks | `NEXT_PUBLIC_SITE_URL` |

## Shipped — enable when ready

| Integration | Status in app | Env vars (optional until used) |
|-------------|---------------|--------------------------------|
| **Resend** | Listing approval + transactional email; logs if unset | `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_ALERT_EMAIL` |
| **Paystack** | Tenant rent checkout + webhook | `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` |
| **Flutterwave** | Webhook scaffold; checkout TBD | `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_PUBLIC_KEY`, `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_WEBHOOK_SECRET` |
| **OPay** | Cashier init + webhook when configured | `OPAY_MERCHANT_ID`, `OPAY_PUBLIC_KEY`, `OPAY_PRIVATE_KEY` |

Webhook URLs: `https://adab.ng/api/payments/paystack/webhook`, `.../flutterwave/webhook`, `.../opay/webhook`. See `docs/OPAY-SETUP.md` for OPay.

## Phase 1 AI (Gemini)

| Feature | Route | Env |
|---------|-------|-----|
| Listing description | `POST /api/ai/listing-description` | `GOOGLE_GENERATIVE_AI_API_KEY` |
| NL property search | `POST /api/ai/property-search` | same |
| Inquiry triage | `POST /api/ai/inquiry-triage` | same |
| Application summary | `POST /api/ai/application-summary` | same |

Details: `docs/AI-ROADMAP.md`. Rate limits use **Upstash** when set: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## Security & abuse (optional)

| Control | Behavior if unset |
|---------|---------------------|
| **Cloudflare Turnstile** | Forms skip challenge | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| **Upstash rate limit** | Lighter in-process limits only | `UPSTASH_REDIS_REST_*` |
| Honeypot / disposable email | Always on in form guard | — |

Implementation: `src/lib/security/*`, `src/components/security/*`.

## Analytics & chat (optional)

| Service | Env vars |
|---------|----------|
| Google Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID` |
| Tawk.to (preferred live chat) | `NEXT_PUBLIC_TAWK_PROPERTY_ID` |
| Crisp (fallback) | `NEXT_PUBLIC_CRISP_WEBSITE_ID` |

## Not in scope

- **Zoho CRM** — removed; leads stay in Supabase (`inquiries`, `pm_applications`).
- Paid add-ons beyond free tiers are out of scope for this doc; use provider dashboards for quotas.

## Quick audit

1. Copy `.env.example` → Vercel env (see `docs/VERCEL-AGENT-WORKFLOW.md`).
2. Open admin integrations panel after deploy.
3. Run a smoke test: inquiry form, portal listing save, one AI route with key set.
