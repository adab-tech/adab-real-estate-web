import { IntegrationStatusPanel } from "@/components/admin/IntegrationStatusPanel";
import { getIntegrationStatuses } from "@/lib/integrations";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const integrations = await getIntegrationStatuses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Settings
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Integration status for production services. Secrets are never shown
          here — only whether required environment variables are set.
        </p>
      </div>

      <IntegrationStatusPanel integrations={integrations} />

      <section className="rounded-2xl border border-adab-gray-300 bg-white p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Admin mutations</h2>
        <p className="mt-2">
          Listing approval, application review, and payment webhooks use{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          when set in Vercel. Without it, admin actions fall back to the signed-in
          admin JWT (requires{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            supabase/fix-admin-approve-actions.sql
          </code>
          ).
        </p>
      </section>

      <section className="rounded-2xl border border-adab-gray-300 bg-white p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Zoho CRM setup</h2>
        <p className="mt-2">
          Full guide:{" "}
          <a
            href="https://github.com/adab-tech/adab-real-estate-web/blob/master/docs/ZOHO-CRM-SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:text-adab-gold-500"
          >
            ZOHO-CRM-SETUP.md
          </a>{" "}
          ·{" "}
          <a
            href="https://api-console.zoho.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:text-adab-gold-500"
          >
            Zoho API Console
          </a>
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            Create a Zoho CRM Server-based application and generate a refresh
            token with CRM scopes.
          </li>
          <li>
            Add{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              ZOHO_CLIENT_ID
            </code>
            ,{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              ZOHO_CLIENT_SECRET
            </code>
            , and{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              ZOHO_REFRESH_TOKEN
            </code>{" "}
            in Vercel.
          </li>
          <li>
            Set{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              ZOHO_API_DOMAIN
            </code>{" "}
            to your data centre (default{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              zoho.com
            </code>
            ; use{" "}
            <code className="rounded bg-adab-gray-200 px-1 text-xs">
              zoho.eu
            </code>{" "}
            for EU).
          </li>
        </ol>
      </section>

      <section className="rounded-2xl border border-adab-gray-300 bg-white p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Paystack (rent payments)</h2>
        <p className="mt-2">
          Active tenant checkout path. Tenants pay pending rent from{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">/tenant/dashboard</code>.
        </p>
        <p className="mt-2">
          <a
            href="https://dashboard.paystack.com/#/settings/developers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:text-adab-gold-500"
          >
            Paystack dashboard → Developers
          </a>{" "}
          · add{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            PAYSTACK_SECRET_KEY
          </code>{" "}
          and{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
          </code>{" "}
          in Vercel. Also set{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          so webhooks can mark payments paid.
        </p>
        <p className="mt-3 font-medium text-adab-navy-800">Webhook URL</p>
        <p className="mt-1">
          Paystack → Settings → Webhooks:
        </p>
        <p className="mt-2">
          <code className="block rounded bg-adab-gray-200 px-2 py-1 text-xs">
            {process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng"}
            /api/payments/paystack/webhook
          </code>
        </p>
        <p className="mt-2 text-xs text-adab-gray-500">
          Validates{" "}
          <code className="rounded bg-adab-gray-200 px-1">x-paystack-signature</code>{" "}
          against <code className="rounded bg-adab-gray-200 px-1">PAYSTACK_SECRET_KEY</code>.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-adab-gray-300 bg-adab-cream/50 p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Site analytics</h2>
        <p className="mt-2">
          Page views are collected on public pages via{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            /api/analytics/collect
          </code>
          . Inserts require{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          in Vercel. Run{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            supabase/analytics.sql
          </code>{" "}
          once, then check{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            /admin/analytics
          </code>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-adab-gray-300 bg-adab-cream/50 p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Flutterwave (Phase 2)</h2>
        <p className="mt-2">
          <a
            href="https://dashboard.flutterwave.com/settings/developers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:text-adab-gold-500"
          >
            Flutterwave dashboard → Developers
          </a>{" "}
          · checkout UI not wired yet; Paystack remains the active rent path.
        </p>
        <p className="mt-3 font-medium text-adab-navy-800">Webhook URL (scaffold)</p>
        <p className="mt-1">
          Flutterwave → Settings → Webhooks — set the secret hash to match{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            FLUTTERWAVE_WEBHOOK_SECRET
          </code>{" "}
          in Vercel:
        </p>
        <p className="mt-2">
          <code className="block rounded bg-adab-gray-200 px-2 py-1 text-xs">
            {process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng"}
            /api/payments/flutterwave/webhook
          </code>
        </p>
        <p className="mt-2 text-xs text-adab-gray-500">
          Env vars:{" "}
          <code className="rounded bg-adab-gray-200 px-1">FLUTTERWAVE_SECRET_KEY</code>,{" "}
          <code className="rounded bg-adab-gray-200 px-1">
            NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
          </code>,{" "}
          <code className="rounded bg-adab-gray-200 px-1">FLUTTERWAVE_WEBHOOK_SECRET</code>.
        </p>
      </section>
    </div>
  );
}
