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
    </div>
  );
}
