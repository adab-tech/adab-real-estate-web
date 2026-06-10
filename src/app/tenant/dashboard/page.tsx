import Link from "next/link";
import { redirect } from "next/navigation";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { requireTenantUser } from "@/lib/tenant/profile";

export const metadata = {
  title: "Tenant Dashboard",
};

type ApplicationRow = {
  id: string;
  application_type: string;
  status: string;
  property_slug: string | null;
  created_at: string;
};

type MaintenanceRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
};

export default async function TenantDashboardPage() {
  const session = await requireTenantUser();
  if (!session) redirect("/tenant/login");
  if (!session.verified) redirect("/tenant/verify-email?reason=confirm");

  const { supabase, user, profile } = session;

  const [applicationsRes, maintenanceRes, leasesRes] = await Promise.all([
    supabase
      .from("tenant_applications")
      .select("id, application_type, status, property_slug, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("maintenance_requests")
      .select("id, title, status, priority, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("tenant_leases")
      .select("id, property_title, status, next_rent_due")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const applications = (applicationsRes.data ?? []) as ApplicationRow[];
  const maintenance = (maintenanceRes.data ?? []) as MaintenanceRow[];
  const leases = leasesRes.data ?? [];

  return (
    <>
      <TenantHeader variant="dashboard" />
      <main className="portal-shell mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-adab-navy-800">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-adab-gray-500">
          Manage applications, maintenance, and leases from one place.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="portal-card p-4">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              KYC status
            </p>
            <p className="mt-1 font-semibold capitalize text-adab-navy-800">
              {profile?.kyc_status ?? "unverified"}
            </p>
          </div>
          <div className="portal-card p-4">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              Applications
            </p>
            <p className="mt-1 font-semibold text-adab-navy-800">
              {applications.length}
            </p>
          </div>
          <div className="portal-card p-4">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              Open maintenance
            </p>
            <p className="mt-1 font-semibold text-adab-navy-800">
              {maintenance.filter((m) => m.status === "open" || m.status === "in_progress").length}
            </p>
          </div>
        </div>

        <section className="portal-card mt-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-adab-navy-800">
              Recent applications
            </h2>
            <Link href="/tenant/applications/new" className="text-sm font-semibold text-adab-gold-600">
              + New application
            </Link>
          </div>
          {applications.length === 0 ? (
            <p className="mt-4 text-sm text-adab-gray-500">
              No applications yet.{" "}
              <Link href="/tenant/applications/new" className="font-semibold text-adab-navy-800">
                Submit a rental application
              </Link>
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-adab-gray-300">
              {applications.map((app) => (
                <li key={app.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <span className="font-medium capitalize text-adab-navy-800">
                    {app.application_type.replace("_", " ")}
                    {app.property_slug ? ` · ${app.property_slug}` : ""}
                  </span>
                  <span className="capitalize text-adab-gray-500">{app.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="portal-card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-adab-navy-800">
              Maintenance requests
            </h2>
            <Link href="/tenant/maintenance/new" className="text-sm font-semibold text-adab-gold-600">
              + New request
            </Link>
          </div>
          {maintenance.length === 0 ? (
            <p className="mt-4 text-sm text-adab-gray-500">
              No maintenance requests yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-adab-gray-300">
              {maintenance.map((item) => (
                <li key={item.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <span className="font-medium text-adab-navy-800">{item.title}</span>
                  <span className="capitalize text-adab-gray-500">
                    {item.priority} · {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="portal-card mt-6 p-6">
          <h2 className="font-display text-xl font-semibold text-adab-navy-800">
            Leases & payments
          </h2>
          {leases.length === 0 ? (
            <p className="mt-4 text-sm text-adab-gray-500">
              No active leases yet. Paystack rent payments will appear here in a
              future release.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-adab-gray-300">
              {leases.map((lease) => (
                <li key={lease.id} className="py-3 text-sm">
                  <p className="font-medium text-adab-navy-800">{lease.property_title}</p>
                  <p className="text-adab-gray-500 capitalize">
                    {lease.status}
                    {lease.next_rent_due
                      ? ` · Next rent due ${lease.next_rent_due}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
