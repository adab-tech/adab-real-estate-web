# adab.ng Operations Manual

Last updated for shipped state: `d3b8cc8` ("Ship OG images, Speed Insights, and Vercel student setup").

## System overview

- Frontend/app hosting: Vercel (Next.js app, preview + production deploys).
- Database/auth/storage: Supabase (tables, RLS, auth, `brand-assets` storage bucket).
- Transactional email: Resend (listing/application status notifications).
- Payments:
  - Primary live flow: Paystack webhook + tenant rent payment records.
  - Additional configured/scaffolded rails: OPay (webhook + signature verification), Flutterwave (webhook scaffold).

## Access and ownership

- Product/domain owner: approves production releases and incidents.
- Code owners/engineering:
  - GitHub repo and pull requests.
  - Vercel project settings and deploy approvals.
  - Supabase schema changes and SQL execution.
- Operations owner:
  - Payment webhook dashboard config (Paystack/OPay).
  - Resend sender/API key health.
  - Incident command and status updates.
- Security owner:
  - Env secret handling and key rotation.
  - Admin access audits.

## Daily and weekly operational checklist

### Daily

- Check Vercel production deployment health and function errors.
- Check `/admin/settings` integration badges for regressions.
- Confirm no backlog of failed payment webhooks.
- Confirm no critical Supabase auth/database errors in logs.
- Confirm admin approve/deny actions are persisting.

### Weekly

- Review all production env vars (names only), confirm no accidental removal.
- Review Supabase table/storage growth and quotas.
- Validate payment webhook endpoints and signature verification behavior.
- Rotate/renew any expiring keys and provider credentials.
- Run a small smoke-test pass on admin + tenant payment flow.

## Deploy workflow

1. Create/update branch in GitHub.
2. Open PR and validate Vercel Preview deployment.
3. Run smoke checks on preview for touched areas.
4. Merge to `master`.
5. Vercel Git integration deploys production automatically.
6. Run post-deploy smoke tests (see checklist below).

Notes:

- Current shipped production baseline is commit `d3b8cc8`.
- Docs-only changes (like this runbook) do not require manual redeploy.

## Environment variable matrix (names only)

As of `d3b8cc8`, only 5 production vars are currently confirmed set: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`.

### Required for core production

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Required for stable admin/server operations

- `SUPABASE_SERVICE_ROLE_KEY`

### Required for payment collection (Paystack live flow)

- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (or `PAYSTACK_PUBLIC_KEY`)

### Optional/recommended integrations

- `ADMIN_ALERT_EMAIL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TAWK_PROPERTY_ID`
- `NEXT_PUBLIC_CRISP_WEBSITE_ID`
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_PUBLIC_KEY`
- `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
- `FLUTTERWAVE_WEBHOOK_SECRET`
- `OPAY_MERCHANT_ID`
- `OPAY_PUBLIC_KEY`
- `OPAY_PRIVATE_KEY`

## SQL migration runbook

SQL source of truth: `supabase/*.sql`

### Fresh project order

1. `schema.sql`
2. `seed.sql`
3. `portal-schema.sql`
4. `cms-posts.sql`
5. `tenant-portal.sql`
6. `analytics.sql`
7. `seed-admin.sql` (after admin user signup)

### Existing project / repair flow

1. `fix-all.sql`
2. `tenant-portal.sql` (if PM/rent tables missing)
3. `analytics.sql` (if analytics empty/missing)
4. `fix-admin-approve-actions.sql` (if admin actions fail to persist)
5. Targeted fixes as needed: `fix-missing-profiles.sql`, `fix-is-admin-jwt.sql`, `grant-full-admin.sql`, `fix-tenant-portal-fk.sql`, `fix-properties-id.sql`, `fix-published-at.sql`, `fix-tenant-applications-mismatch.sql`

Safety notes:

- Run SQL in Supabase SQL Editor in the documented order.
- Run fix scripts only when symptoms match; many are idempotent but still review first.
- Back up critical tables before major repair scripts.
- Do not run SQL directly against production without an incident/change ticket note.

## Webhook operations

### Paystack

- Endpoint: `https://adab.ng/api/payments/paystack/webhook`
- Required event: `charge.success`
- Verification check:
  - Header `x-paystack-signature` must validate against `PAYSTACK_SECRET_KEY`.
  - Returns `401` on invalid signature and does not mutate payments.
- Success effect: updates `rent_payments` pending rows to `paid`.

### OPay

- Endpoint: `https://adab.ng/api/payments/opay/webhook`
- Verification check:
  - Header `x-opay-signature` (or `signature`) must validate with OPay keys.
  - Returns `401` on invalid signature.
- Success effect: updates `rent_payments` pending rows to `paid`.

## Monitoring and logs

- Vercel:
  - Monitor production function errors and deploy failures.
  - Check logs for payment webhook route responses and AI route failures.
- Supabase:
  - Monitor Postgres/auth logs for permission errors and failed writes.
  - Watch table/storage health for `rent_payments`, `pm_applications`, `brand_template_drafts`, and `brand-assets`.
- Failed webhook operations:
  - Track provider dashboard delivery status.
  - Correlate with Vercel log statuses (`401`, `400`, `500`, `503`).

## Incident playbooks

### A) Admin approve/deny failing

Symptoms:

- Approve/reject action returns "did not persist" for listings or PM applications.

Actions:

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is present in Vercel.
2. Run `supabase/fix-admin-approve-actions.sql`.
3. Confirm admin is properly privileged; run `grant-full-admin.sql` only if required.
4. Sign out/in and retest from `/admin/listings/pending` and `/admin/pm/applications`.

### B) AI endpoints failing

Symptoms:

- `/api/ai/inquiry-triage` or `/api/ai/application-summary` returns `503`, `429`, or `500`.

Actions:

1. If `503`: set `GOOGLE_GENERATIVE_AI_API_KEY`.
2. If `429`: review request burst; validate Upstash rate-limit config for consistent throttling.
3. If `500`: inspect Vercel logs for `[ai]` errors and payload validation failures.
4. Retest from admin UI after key/config updates.

### C) Payment webhook not recording

Symptoms:

- Successful provider charge but `rent_payments` remains `pending`.

Actions:

1. Verify provider webhook URL points to production endpoint.
2. Verify signing secret/key matches current Vercel env vars.
3. Check webhook logs for `401` signature failures or `503` DB config failures.
4. Confirm `SUPABASE_SERVICE_ROLE_KEY` is set and `rent_payments` row has matching reference/payment metadata.
5. Replay webhook from provider dashboard after fix.

### D) Brand editor upload/drafts not working

Symptoms:

- Save draft fails, upload fails, or draft list does not refresh in `/admin/brand/editor`.

Actions:

1. Verify admin auth/session is valid (brand actions require admin auth).
2. Ensure SQL for drafts/storage exists: run `brand-template-drafts.sql` and `brand-assets-storage.sql` if missing.
3. Confirm `brand-assets` bucket exists and policies permit admin upload.
4. Check Supabase storage logs and Vercel action errors.
5. Re-test upload and draft CRUD flow.

## Rollback procedure

1. Identify last known-good production commit in GitHub (baseline currently `d3b8cc8`).
2. Revert offending commit(s) in a PR (preferred) or redeploy previous commit from Vercel.
3. If schema caused issue, apply matching rollback/fix SQL in controlled order.
4. Validate critical smoke tests before incident close.
5. Document root cause and follow-up prevention task.

## Security and backup checklist

- Never commit secrets (`.env.local`, tokens, service keys).
- Keep payment/API keys only in Vercel/Supabase provider consoles.
- Enforce least privilege on admin users and service accounts.
- Regularly back up Supabase data and verify restore path.
- Rotate service-role and payment keys after any suspected leak.
- Keep Turnstile and rate limiting enabled for public-facing abuse surfaces.

## Day-0 launch checklist

- Domain and DNS verified for `adab.ng`.
- Required core env vars present.
- `SUPABASE_SERVICE_ROLE_KEY` set.
- Payment keys/webhook URLs configured if collecting rent online.
- Supabase SQL baseline applied.
- Admin account promoted and can access all admin panels.
- Resend sender domain/API key verified.
- Incident contacts and ownership roles confirmed.

## Post-deploy smoke tests

- Home and `/properties` load correctly.
- `/admin/settings` integration statuses render.
- Listing approve/reject works and persists.
- PM application status update persists.
- Tenant pending payment can be marked paid through webhook flow.
- AI admin tools run (or gracefully show "not configured" when key absent).
- Brand editor saves draft and uploads asset.
- Logs show no new critical errors after release.
