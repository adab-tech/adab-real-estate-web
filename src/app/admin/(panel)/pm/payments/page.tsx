import { requireAdmin } from "@/lib/supabase/auth-server";
import { recordManualPaymentForm } from "@/app/admin/pm-actions";
import { PAYMENT_STATUS_LABELS, type PaymentStatus } from "@/types/tenant-portal";

type PaymentRow = {
  id: string;
  tenant_id: string;
  amount_ngn: number;
  payment_type: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
};

export default async function PmPaymentsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: payments, error }, { data: tenants }] = await Promise.all([
    supabase
      .from("rent_payments")
      .select("id, tenant_id, amount_ngn, payment_type, status, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("tenant_profiles")
      .select("id, profiles(full_name, email)")
      .limit(200),
  ]);

  if (error) {
    return (
      <p className="text-red-600">Failed to load payments: {error.message}</p>
    );
  }

  const tenantOptions = (tenants ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id as string,
      fullName: (profile?.full_name as string | null) ?? null,
      email: (profile?.email as string) ?? "",
    };
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <h2 className="font-display text-lg font-bold text-adab-navy-800">
          Record manual payment
        </h2>
        <form action={recordManualPaymentForm} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-adab-gray-500">
              Tenant
            </label>
            <select
              name="tenant_id"
              required
              className="w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="">Select tenant</option>
              {tenantOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName ?? t.email ?? t.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-adab-gray-500">
              Amount (₦)
            </label>
            <input
              name="amount_ngn"
              type="number"
              min={1}
              required
              className="w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-adab-gray-500">
              Payment type
            </label>
            <select
              name="payment_type"
              className="w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="rent">Rent</option>
              <option value="deposit">Deposit</option>
              <option value="service_charge">Service charge</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-adab-gray-500">
              Notes
            </label>
            <input
              name="notes"
              className="w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-adab-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700"
            >
              Record payment
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-adab-navy-800">
          Payment history
        </h2>
        {(payments ?? []).length === 0 ? (
          <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
            No payments recorded yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {(payments as PaymentRow[]).map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-adab-gray-300 last:border-0"
                  >
                    <td className="px-4 py-3 capitalize text-adab-navy-800">
                      {payment.payment_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₦{Number(payment.amount_ngn).toLocaleString("en-NG")}
                    </td>
                    <td className="px-4 py-3">
                      {PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
                    </td>
                    <td className="px-4 py-3 text-adab-gray-500">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString("en-NG")
                        : new Date(payment.created_at).toLocaleDateString(
                            "en-NG",
                          )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
