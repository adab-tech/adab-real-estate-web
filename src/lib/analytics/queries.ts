import type { SupabaseClient } from "@supabase/supabase-js";
import { formatCountryLabel } from "@/lib/analytics/geo";
import { formatReferrerLabel } from "@/lib/analytics/referrer";

export type PageViewRow = {
  id: string;
  path: string;
  referrer: string | null;
  referrer_source: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string;
  browser: string;
  visitor_id: string | null;
  created_at: string;
};

export type BreakdownRow = {
  label: string;
  count: number;
};

export type AnalyticsSummary = {
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

function sinceDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function startOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function countRows(rows: PageViewRow[], since: string): number {
  return rows.filter((r) => r.created_at >= since).length;
}

function uniqueVisitors(rows: PageViewRow[], since: string): number {
  const ids = new Set<string>();
  for (const row of rows) {
    if (row.created_at >= since && row.visitor_id) {
      ids.add(row.visitor_id);
    }
  }
  return ids.size;
}

function groupBy(
  rows: PageViewRow[],
  since: string,
  key: (row: PageViewRow) => string,
  labelFn?: (key: string) => string,
  limit = 10,
): BreakdownRow[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.created_at < since) continue;
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, count]) => ({
      label: labelFn ? labelFn(k) : k,
      count,
    }));
}

export async function fetchAnalyticsSummary(
  supabase: SupabaseClient,
): Promise<AnalyticsSummary | null> {
  const since30d = sinceDays(30);

  const { data, error } = await supabase
    .from("page_views")
    .select(
      "id, path, referrer, referrer_source, country, region, city, device_type, browser, visitor_id, created_at",
    )
    .gte("created_at", since30d)
    .order("created_at", { ascending: false })
    .limit(15000);

  if (error) {
    console.error("[analytics] fetch failed:", error.message);
    return null;
  }

  const rows = (data ?? []) as PageViewRow[];
  const today = startOfTodayUtc();
  const d7 = sinceDays(7);

  return {
    viewsToday: countRows(rows, today),
    views7d: countRows(rows, d7),
    views30d: rows.length,
    visitorsToday: uniqueVisitors(rows, today),
    visitors7d: uniqueVisitors(rows, d7),
    visitors30d: uniqueVisitors(rows, since30d),
    byCountry: groupBy(
      rows,
      d7,
      (r) => r.country ?? "unknown",
      (k) => (k === "unknown" ? "Unknown" : formatCountryLabel(k)),
    ),
    byRegion: groupBy(
      rows.filter((r) => r.country === "NG"),
      d7,
      (r) => r.region ?? "Unknown",
    ),
    byDevice: groupBy(rows, d7, (r) => r.device_type, (k) =>
      k.charAt(0).toUpperCase() + k.slice(1),
    ),
    byBrowser: groupBy(rows, d7, (r) => r.browser),
    byReferrer: groupBy(rows, d7, (r) => r.referrer_source, formatReferrerLabel),
    topPaths: groupBy(rows, d7, (r) => r.path),
  };
}

export async function fetchRecentViewCount(
  supabase: SupabaseClient,
  days = 7,
): Promise<number | null> {
  const { count, error } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sinceDays(days));

  if (error) return null;
  return count ?? 0;
}
