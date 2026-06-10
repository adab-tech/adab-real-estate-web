import type { BreakdownRow } from "@/lib/analytics/queries";

function StatCard({
  label,
  views,
  visitors,
}: {
  label: string;
  views: number;
  visitors: number;
}) {
  return (
    <div className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-adab-gray-500">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-bold text-adab-navy-800">
        {views.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-adab-gray-500">
        {visitors.toLocaleString()} unique visitors
      </p>
    </div>
  );
}

function BreakdownTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: BreakdownRow[];
}) {
  const max = rows[0]?.count ?? 1;

  return (
    <section className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
      <h2 className="font-display text-lg font-bold text-adab-navy-800">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-adab-gray-500">{subtitle}</p>
      ) : null}

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-adab-gray-500">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-adab-navy-800">
                  {row.label}
                </span>
                <span className="shrink-0 tabular-nums text-adab-gray-500">
                  {row.count.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-adab-gray-200">
                <div
                  className="h-full rounded-full bg-adab-gold-500"
                  style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AnalyticsPanels({
  summary,
}: {
  summary: {
    viewsToday: number;
    views7d: number;
    views30d: number;
    visitorsToday: number;
    visitors7d: number;
    visitors30d: number;
    byCountry: BreakdownRow[];
    byRegion: BreakdownRow[];
    byDevice: BreakdownRow[];
    byBrowser: BreakdownRow[];
    byReferrer: BreakdownRow[];
    topPaths: BreakdownRow[];
  };
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Today"
          views={summary.viewsToday}
          visitors={summary.visitorsToday}
        />
        <StatCard
          label="Last 7 days"
          views={summary.views7d}
          visitors={summary.visitors7d}
        />
        <StatCard
          label="Last 30 days"
          views={summary.views30d}
          visitors={summary.visitors30d}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownTable
          title="Geography — country"
          subtitle="Last 7 days"
          rows={summary.byCountry}
        />
        <BreakdownTable
          title="Geography — Nigerian states"
          subtitle="Visitors from NG only, last 7 days"
          rows={summary.byRegion}
        />
        <BreakdownTable
          title="Device type"
          subtitle="Last 7 days"
          rows={summary.byDevice}
        />
        <BreakdownTable
          title="Browser"
          subtitle="Last 7 days"
          rows={summary.byBrowser}
        />
        <BreakdownTable
          title="Traffic source"
          subtitle="Referrer, last 7 days"
          rows={summary.byReferrer}
        />
        <BreakdownTable
          title="Top pages"
          subtitle="Last 7 days"
          rows={summary.topPaths}
        />
      </div>
    </div>
  );
}
