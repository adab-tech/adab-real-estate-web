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
        <h2 className="font-semibold text-adab-navy-800">Zoho CRM setup</h2>
        <p className="mt-2">
          Step-by-step guide:{" "}
          <a
            href="https://github.com/adab-tech/adab-real-estate-web/blob/master/docs/ZOHO-CRM-SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:text-adab-gold-500"
          >
            ZOHO-CRM-SETUP.md
          </a>{" "}
          (in repo <code className="rounded bg-adab-gray-200 px-1 text-xs">docs/</code>
          ).
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
        <h2 className="font-semibold text-adab-navy-800">Paystack webhook</h2>
        <p className="mt-2">
          When online rent payments are enabled, register this URL in Paystack →
          Settings → Webhooks:
        </p>
        <p className="mt-2">
          <code className="block rounded bg-adab-gray-200 px-2 py-1 text-xs">
            {process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng"}
            /api/payments/paystack/webhook
          </code>
        </p>
        <p className="mt-2 text-xs text-adab-gray-500">
          Webhook requests are rejected unless the{" "}
          <code className="rounded bg-adab-gray-200 px-1">x-paystack-signature</code>{" "}
          header matches <code className="rounded bg-adab-gray-200 px-1">PAYSTACK_SECRET_KEY</code>.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-adab-gray-300 bg-adab-cream/50 p-5 text-sm text-adab-gray-600">
        <h2 className="font-semibold text-adab-navy-800">Flutterwave (Phase 2)</h2>
        <p className="mt-2">
          Alternative payment provider — env vars are listed above in integration
          status. Checkout and webhooks are not wired yet; Paystack is the
          active path for tenant rent payments.
        </p>
        <p className="mt-2 text-xs text-adab-gray-500">
          Set{" "}
          <code className="rounded bg-adab-gray-200 px-1">FLUTTERWAVE_SECRET_KEY</code>{" "}
          and{" "}
          <code className="rounded bg-adab-gray-200 px-1">
            NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
          </code>{" "}
          when Phase 2 checkout is implemented.
        </p>
      </section>
    </div>
  );
}
