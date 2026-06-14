import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function PmOverviewPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: tenantCount },
    { count: openMaintenance },
    { count: pendingApplications },
    { count: activeLeases },
  ] = await Promise.all([
    supabase
      .from("tenant_profiles")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("maintenance_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "submitted", "assigned", "in_progress"]),
    supabase
      .from("pm_applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "reviewing"]),
    supabase
      .from("leases")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const stats = [
    {
      label: "Tenants",
      value: tenantCount ?? 0,
      href: "/admin/pm/tenants",
    },
    {
      label: "Open maintenance",
      value: openMaintenance ?? 0,
      href: "/admin/pm/maintenance",
    },
    {
      label: "Pending applications",
      value: pendingApplications ?? 0,
      href: "/admin/pm/applications",
    },
    {
      label: "Active leases",
      value: activeLeases ?? 0,
      href: "/admin/pm/leases",
    },
  ];

  return (
    <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.href}
          href={stat.href}
          className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-colors hover:border-adab-gold-500"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-adab-gray-500">
            {stat.label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-adab-navy-800">
            {stat.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
