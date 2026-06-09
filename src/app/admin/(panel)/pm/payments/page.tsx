import { PmNav } from "@/components/admin/PmNav";
import { recordManualPaymentForm } from "@/app/admin/pm-actions";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { PAYMENT_STATUS_LABELS } from "@/types/tenant-portal";
import { isPaystackConfigured } from "@/lib/paystack/stub";

export default async function PmPaymentsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: payments, error }, { data: tenants }] = await Promise.all([
    supabase
      .from("rent_payments")
      .select("id, amount_ngn, payment_type, status, paystack_reference, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("tenant_profiles")
      .select("id, profiles(full_name, email)")
      .limit(200),
  ]);

  if (error) {
    return <p className="text-red-600">Failed to load payments: {error.message}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Rent & payments
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Phase 1: manual records. Paystack checkout{" "}
          {isPaystackConfigured() ? "configured" : "stub — add PAYSTACK_SECRET_KEY"}.
        </p>
      </div>

      <PmNav activePath="/admin/pm/payments" />

      <section className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <h2 className="font-display text-lg font-bold text-adab-navy-800">
          Record manual payment
        </h2>
        <form action={recordManualPaymentForm} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="portal-label" htmlFor="tenant_id">
              Tenant
            </label>
            <select className="portal-select" id="tenant_id" name="tenant_id" required>
              <option value="">Select tenant</option>
              {(tenants ?? []).map((t) => {
                const profile = t.profiles as {
                  full_name?: string;
                  email?: string;
                } | null;
                return (
                  <option key={t.id} value={t.id}>
                    {profile?.full_name ?? profile?.email ?? t.id}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="portal-label" htmlFor="amount_ngn">
              Amount (NGN)
            </label>
            <input
              className="portal-input"
              id="amount_ngn"
              name="amount_ngn"
              type="number"
              min={1}
              required
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="payment_type">
              Type
            </label>
            <select className="portal-select" id="payment_type" name="payment_type">
              <option value="rent">Rent</option>
              <option value="deposit">Deposit</option>
              <option value="service_charge">Service charge</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="portal-label" htmlFor="notes">
              Notes
            </label>
            <input className="portal-input" id="notes" name="notes" />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-adab-gold-500 px-5 py-2.5 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
            >
              Record payment
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-adab-navy-800">
          Payment history
        </h2>
        {(payments ?? []).length === 0 ? (
          <p className="rounded-2xl border border-adab-gray-300 bg-white p-6 text-sm text-adab-gray-500">
            No payments recorded yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
                <tr>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {(payments ?? []).map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-adab-gray-300 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      ₦{Number(payment.amount_ngn).toLocaleString("en-NG")}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {payment.payment_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3">
                      {PAYMENT_STATUS_LABELS[
                        payment.status as keyof typeof PAYMENT_STATUS_LABELS
                      ] ?? payment.status}
                    </td>
                    <td className="px-4 py-3 text-xs text-adab-gray-500">
                      {payment.paystack_reference ?? "—"}
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
