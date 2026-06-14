import Link from "next/link";
import { redirect } from "next/navigation";
import { PayRentButton } from "@/components/tenant/PayRentButton";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { isPaystackConfigured } from "@/lib/payments/paystack";
import { requireTenantUser } from "@/lib/tenant/profile";

export const metadata = {
  title: "Tenant Dashboard",
};

type ApplicationRow = {
  id: string;
  application_type: string;
  status: string;
  property_interest: string | null;
  created_at: string;
};

type MaintenanceRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
};

type RentPaymentRow = {
  id: string;
  amount_ngn: number;
  payment_type: string;
  status: string;
  created_at: string;
};

export default async function TenantDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const paymentSuccess = payment === "success";

  const session = await requireTenantUser();
  if (!session) redirect("/tenant/login");
  if (!session.verified) redirect("/tenant/verify-email?reason=confirm");

  const { supabase, user, profile } = session;

  const [applicationsRes, maintenanceRes, leasesRes, paymentsRes] = await Promise.all([
    supabase
      .from("pm_applications")
      .select("id, application_type, status, property_interest, created_at")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("maintenance_requests")
      .select("id, title, status, priority, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("leases")
      .select("id, property_title, status, lease_end")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("rent_payments")
      .select("id, amount_ngn, payment_type, status, created_at")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const applications = (applicationsRes.data ?? []) as ApplicationRow[];
  const maintenance = (maintenanceRes.data ?? []) as MaintenanceRow[];
  const leases = leasesRes.data ?? [];
  const payments = (paymentsRes.data ?? []) as RentPaymentRow[];
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const paystackEnabled = isPaystackConfigured();

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

        {paymentSuccess ? (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Payment received — thank you. Your rent status updates once Paystack
            confirms the transaction (usually within a minute).
          </p>
        ) : null}

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
                    {app.property_interest ? ` · ${app.property_interest}` : ""}
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
          {pendingPayments.length > 0 ? (
            <ul className="mt-4 divide-y divide-adab-gray-300">
              {pendingPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium capitalize text-adab-navy-800">
                      {payment.payment_type.replace(/_/g, " ")} due
                    </p>
                    <p className="text-adab-gray-500">
                      ₦{Number(payment.amount_ngn).toLocaleString("en-NG")}
                    </p>
                  </div>
                  {paystackEnabled ? (
                    <PayRentButton
                      paymentId={payment.id}
                      amountNgn={Number(payment.amount_ngn)}
                    />
                  ) : (
                    <span className="text-xs text-adab-gray-500">
                      Contact Adab to pay by transfer
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : leases.length === 0 ? (
            <p className="mt-4 text-sm text-adab-gray-500">
              No active leases or pending payments yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-adab-gray-300">
              {leases.map((lease) => (
                <li key={lease.id} className="py-3 text-sm">
                  <p className="font-medium text-adab-navy-800">
                    {lease.property_title || "Property"}
                  </p>
                  <p className="text-adab-gray-500 capitalize">
                    {lease.status}
                    {lease.lease_end ? ` · Ends ${lease.lease_end}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {payments.some((p) => p.status === "paid" || p.status === "manual") ? (
            <p className="mt-4 text-xs text-adab-gray-500">
              Recent paid items appear in your payment history once processed.
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}
