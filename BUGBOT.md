# Bugbot review guide — Adab Real Estate Web

## Priority checks

### Security
- [ ] No secrets in source (API keys, service role keys, webhook secrets)
- [ ] Public forms use `guardPublicForm` or equivalent rate limiting
- [ ] Admin/server mutations call `requireAdmin()` or `requireAdminMutationClient()`
- [ ] AI routes enforce auth (portal for listing-desc, admin for triage/summary)
- [ ] User input validated with Zod before DB writes
- [ ] Turnstile token verified server-side when configured

### Supabase / data
- [ ] RLS not bypassed from client components
- [ ] Service role only used in server actions / API routes
- [ ] No raw SQL from user input
- [ ] Inserts include required fields and correct status defaults

### AI routes
- [ ] Rate limited via `guardAiRequest`
- [ ] Structured outputs use Zod schemas
- [ ] Graceful error when `GOOGLE_GENERATIVE_AI_API_KEY` missing
- [ ] No PII logged to console in production paths

### Email
- [ ] Admin alerts fire async (void + catch) after successful DB insert
- [ ] Resend failures don't block user-facing success responses

### Next.js
- [ ] Server/client boundary respected (`"use client"` / `"use server"`)
- [ ] No deprecated Next.js 15 patterns incompatible with Next 16
- [ ] Images use `next/image` or documented exceptions

### Brand / UX
- [ ] Adab navy/gold palette — no off-brand colors on public pages
- [ ] Mobile-responsive (tablet/desktop breakpoints used consistently)

## Out of scope for auto-review

- Supabase SQL in sibling repo
- Payment provider checkout UI (webhooks only until Phase 2)
- Zoho CRM (removed — flag any reintroduction)

## Deploy gate

Before approving a PR that ships to production:

1. `npm run build` passes
2. New env vars documented in `.env.example`
3. No breaking changes to auth callback URLs
