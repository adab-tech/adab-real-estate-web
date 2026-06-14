# Adab Real Estate Web — Agent Guide

<!-- BEGIN:nextjs-agent-rules -->
This project uses **Next.js 16** with breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing routes or server code. Heed deprecation notices in the codebase.
<!-- END:nextjs-agent-rules -->

## Repository

| Item | Value |
|------|-------|
| **Source of truth** | `adab-real-estate-web` (this repo) |
| **Production URL** | https://adab.ng |
| **Deploy target** | Vercel — scope `adab-techs-projects` |
| **Database / Auth** | Supabase (Postgres + Auth + Storage) |
| **Email** | Resend (`RESEND_API_KEY`) |
| **AI** | Google Gemini via Vercel AI SDK (`GOOGLE_GENERATIVE_AI_API_KEY`) |

**Not in scope:** Zoho CRM was removed. Do not re-add Zoho integrations.

## Architecture

```
src/
├── app/
│   ├── (site)/          # Public marketing site
│   ├── admin/           # Admin CMS + PM panel
│   ├── portal/          # Lister self-service portal
│   ├── tenant/          # Tenant portal
│   └── api/             # Route handlers (webhooks, AI, analytics)
├── components/          # React components by domain
├── lib/                 # Shared utilities (supabase, ai, security, email)
└── types/               # TypeScript types
```

## Key conventions

1. **Server actions** live in `src/app/*-actions.ts` or co-located `actions.ts`
2. **Supabase clients:** browser (`createSupabaseBrowserClient`), server (`getSupabaseServerClient`), auth (`createSupabaseAuthClient`)
3. **Admin access:** JWT `role=admin` in app/user metadata OR `profiles.role = admin`
4. **Public forms:** use `guardPublicForm` (honeypot + Turnstile + Upstash rate limit)
5. **Brand colors:** Navy `#1B2A4A`, Gold `#C9A227`, Cream `#F8F6F1`
6. **Fonts:** Plus Jakarta Sans (display), Inter (body)

## Environment variables

Copy `.env.example` → `.env.local` for development. Required for full functionality:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY` (AI features)
- `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_ALERT_EMAIL` (emails)

Optional but recommended in production:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TAWK_PROPERTY_ID` or `NEXT_PUBLIC_CRISP_WEBSITE_ID`

## Deploy workflow

```bash
npm run build          # Must pass before deploy
git push origin master # Triggers Vercel if connected
npx vercel deploy --prod --yes --scope adab-techs-projects
```

## Supabase

- SQL migrations live in the sibling `adab-ng-site/supabase/` folder for reference
- Run SQL manually in Supabase SQL Editor (see `README-RUN-SQL.md` there)
- RLS policies enforce row-level access; service role bypasses RLS for server writes

## AI (Phase 1)

See `docs/AI-ROADMAP.md` for feature list and future phases.

| Route | Purpose |
|-------|---------|
| `/api/ai/listing-description` | Portal listing copy generation |
| `/api/ai/property-search` | NL → filter params |
| `/api/ai/inquiry-triage` | Admin inquiry triage + draft reply |
| `/api/ai/application-summary` | Admin PM application review assist |

## Security

- Cloudflare Turnstile on inquiry, register, and application forms
- Upstash rate limits on forms, auth, and AI routes
- Honeypot field (`website`) on public forms
- Disposable email blocklist on registration
- Security headers in `next.config.ts`

## Brand assets

- Admin: `/admin/brand` → `BrandDownloads` component
- Static files: `public/brand/` and `public/brand/downloads/`
- Regenerate: `npm run brand:assets`

## Do not

- Commit `.env.local` or secrets
- Add Zoho CRM or external CRM sync without explicit approval
- Use `adab-ng-site` as the deploy source (it's the Supabase/docs sibling, not the web app)
- Skip `npm run build` before production deploy
