# OPay setup — Adab Real Estate

OPay Checkout for tenant rent payments. Paystack remains the primary checkout path; OPay is available when configured (alone or alongside Paystack).

---

## 1. OPay merchant account

1. Sign in to the [OPay merchant dashboard](https://doc.opaycheckout.com/).
2. Note your **Merchant ID**, **Public Key**, and **Private Key** (test or live).
3. Register the webhook URL (see below) before going live.

---

## 2. Environment variables (Vercel)

In Vercel → **Settings** → **Environment Variables** (Production):

| Variable | Required | Description |
|----------|----------|-------------|
| `OPAY_MERCHANT_ID` | Yes | Merchant ID from OPay dashboard |
| `OPAY_PUBLIC_KEY` | Yes | Public key (Bearer token for API calls) |
| `OPAY_PRIVATE_KEY` | Yes | Private key for HMAC-SHA512 request/webhook signing |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://adab.ng` — used for return/callback URLs |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Webhook marks rent payments as paid |

Copy the same values locally into `.env.local` for development.

---

## 3. Webhook URL

In the OPay merchant dashboard, set:

```
https://adab.ng/api/payments/opay/webhook
```

The handler verifies the `Signature` (or `x-opay-signature`) header using HMAC-SHA512 with `OPAY_PRIVATE_KEY`, then marks matching `rent_payments` rows as **paid**.

On success the endpoint returns:

```json
{ "code": "00000", "message": "SUCCESSFUL" }
```

Payment references are stored in `rent_payments.paystack_reference` (shared column until a dedicated OPay field exists).

---

## 4. Tenant checkout

When all three `OPAY_*` vars are set, tenants see **Pay with OPay** on `/tenant/dashboard` for pending rent. If Paystack is also configured, both options appear.

---

## 5. Verify

1. Deploy or restart the dev server after setting env vars.
2. Open **`/admin/settings`** — OPay should show **Configured**.
3. Create a pending rent payment for a test tenant and start OPay checkout.
4. Complete a test payment; confirm the webhook marks the row **paid** in Supabase.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **Not configured** on settings | All three `OPAY_*` vars must be set |
| Webhook 401 Invalid signature | Confirm `OPAY_PRIVATE_KEY` matches dashboard; body must be verified raw |
| Payment stays pending | Set `SUPABASE_SERVICE_ROLE_KEY`; check Vercel logs for `[opay webhook]` |
| Checkout fails to start | Confirm live vs test keys and merchant ID |

If admins cannot access `/admin`, run `supabase/grant-full-admin.sql` in the Supabase SQL Editor.
