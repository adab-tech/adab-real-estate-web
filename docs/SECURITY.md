# Security overview

Adab Real Estate uses defense-in-depth on public forms, AI routes, and payment webhooks. Most controls are optional via env vars; honeypot and disposable-email checks are always on.

## Form abuse prevention

| Control | Location | Notes |
|---------|----------|-------|
| Honeypot field | `src/components/security/HoneypotField.tsx`, `src/lib/security/honeypot.ts` | Silent reject on bot fill |
| Disposable email block | `src/lib/security/disposable-emails.ts` | Rejects known throwaway domains |
| Form guard | `src/lib/security/form-guard.ts` | Composes honeypot + email checks |
| Cloudflare Turnstile | `src/components/security/TurnstileWidget.tsx`, `src/lib/security/turnstile.ts` | Skipped when keys unset |
| Rate limiting | `src/lib/security/rate-limit.ts` | Upstash when configured; in-process fallback |

Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## AI API routes

Routes under `src/app/api/ai/*` require authenticated portal/admin context via `src/lib/ai/api-auth.ts`. Rate limits in `src/lib/ai/rate-limit.ts`. Schemas validated with Zod (`src/lib/ai/schemas.ts`). Key: `GOOGLE_GENERATIVE_AI_API_KEY`.

## Payments & webhooks

Paystack, Flutterwave, and OPay webhooks verify signatures before updating Supabase. Secrets live in Vercel env only — never commit `.env.local`.

## Supabase & RLS

- Public reads use anon key with RLS policies on listings, posts, and profiles.
- Server actions and webhooks use `SUPABASE_SERVICE_ROLE_KEY` only on the server.
- Run SQL migrations from `supabase/` in order; review RLS when adding tables.

## Operational checklist

1. Rotate service-role and payment keys if exposed.
2. Enable Turnstile on production inquiry and registration forms.
3. Set Upstash for consistent rate limits across serverless instances.
4. Keep `NEXT_PUBLIC_SITE_URL` aligned with the live domain for CSRF-safe redirects and email links.

See also `docs/INTEGRATIONS-PROPOSAL-FREE.md` for optional integration env vars.
