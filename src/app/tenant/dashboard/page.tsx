import Link from "next/link";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { requireTenant } from "@/lib/tenant/auth-server";
import {
  APPLICATION_STATUS_LABELS,
  KYC_STATUS_LABELS,
  MAINTENANCE_STATUS_LABELS,
} from "@/types/tenant-portal";

export const metadata = {
  title: "Dashboard",
  description: "Your Adab tenant dashboard.",
};

export default async function TenantDashboardPage() {
  const { supabase, user } = await requireTenant();

  const [
    { data: profile },
    { data: applications },
    { data: maintenance },
    { data: leases },
    { data: payments },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("kyc_status")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("pm_applications")
      .select("id, application_type, status, created_at")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("maintenance_requests")
      .select("id, title, status, priority, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leases")
      .select("id, rent_ngn, rent_period, status, lease_start, lease_end")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("rent_payments")
      .select("id, amount_ngn, status, payment_type, paid_at, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const kycStatus = profile?.kyc_status ?? "pending";

  return (
    <>
      <TenantHeader variant="dashboard" />
      <main className="portal-shell mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-adab-navy-800">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-adab-gray-500">{user.email}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="portal-card p-5">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              KYC status
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-adab-navy-800">
              {KYC_STATUS_LABELS[kycStatus as keyof typeof KYC_STATUS_LABELS] ??
                kycStatus}
            </p>
          </div>
          <div className="portal-card p-5">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              Active leases
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-adab-navy-800">
              {(leases ?? []).filter((l) => l.status === "active").length}
            </p>
          </div>
          <div className="portal-card p-5">
            <p className="text-xs font-semibold uppercase text-adab-gray-500">
              Open maintenance
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-adab-navy-800">
              {
                (maintenance ?? []).filter(
                  (m) => !["resolved", "closed", "cancelled"].includes(m.status),
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="portal-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-adab-navy-800">
                Maintenance requests
              </h2>
              <Link
                href="/tenant/maintenance"
                className="text-sm font-semibold text-adab-gold-500"
              >
                New request
              </Link>
            </div>
            {(maintenance ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-adab-gray-500">
                No maintenance requests yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(maintenance ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-adab-gray-300 px-4 py-3 text-sm"
                  >
                    <p className="font-semibold text-adab-navy-800">
                      {item.title}
                    </p>
                    <p className="text-adab-gray-500">
                      {MAINTENANCE_STATUS_LABELS[
                        item.status as keyof typeof MAINTENANCE_STATUS_LABELS
                      ] ?? item.status}{" "}
                      · {item.priority}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="portal-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-adab-navy-800">
                Applications
              </h2>
              <Link
                href="/tenant/apply"
                className="text-sm font-semibold text-adab-gold-500"
              >
                New application
              </Link>
            </div>
            {(applications ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-adab-gray-500">
                No applications submitted yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(applications ?? []).map((app) => (
                  <li
                    key={app.id}
                    className="rounded-xl border border-adab-gray-300 px-4 py-3 text-sm"
                  >
                    <p className="font-semibold capitalize text-adab-navy-800">
                      {app.application_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-adab-gray-500">
                      {APPLICATION_STATUS_LABELS[
                        app.status as keyof typeof APPLICATION_STATUS_LABELS
                      ] ?? app.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {(payments ?? []).length > 0 && (
          <section className="portal-card mt-8 p-6">
            <h2 className="font-display text-lg font-bold text-adab-navy-800">
              Recent payments
            </h2>
            <ul className="mt-4 space-y-3">
              {(payments ?? []).map((payment) => (
                <li
                  key={payment.id}
                  className="flex justify-between rounded-xl border border-adab-gray-300 px-4 py-3 text-sm"
                >
                  <span className="capitalize text-adab-navy-800">
                    {payment.payment_type.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold">
                    ₦{Number(payment.amount_ngn).toLocaleString("en-NG")} ·{" "}
                    {payment.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
