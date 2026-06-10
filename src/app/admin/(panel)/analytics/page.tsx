import { AnalyticsPanels } from "@/components/admin/AnalyticsPanels";
import { fetchAnalyticsSummary } from "@/lib/analytics/queries";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const summary = await fetchAnalyticsSummary(supabase);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Site analytics
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Anonymous page views by geography and device. No personal data is
          stored. Geo fields populate on Vercel via{" "}
          <code className="rounded bg-adab-gray-200 px-1 text-xs">
            x-vercel-ip-country
          </code>{" "}
          headers; local dev shows unknown location.
        </p>
      </div>

      {!summary ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          Analytics unavailable. Run{" "}
          <code className="rounded bg-adab-gray-200 px-1">supabase/analytics.sql</code>{" "}
          in the Supabase SQL Editor, then revisit this page after traffic is
          recorded.
        </p>
      ) : (
        <AnalyticsPanels summary={summary} />
      )}
    </div>
  );
}
