"use client";

import { useActionState } from "react";
import {
  createPendingPayment,
  recordManualPayment,
  type PmActionState,
} from "@/app/admin/pm-actions";

type TenantOption = {
  id: string;
  label: string;
};

type PmPaymentFormsProps = {
  tenants: TenantOption[];
  paystackEnabled: boolean;
};

function ActionFeedback({ state }: { state: PmActionState }) {
  if (!state?.error && !state?.success) return null;

  return (
    <p
      className={`mt-3 text-sm ${state.error ? "text-red-600" : "text-green-700"}`}
      role="status"
    >
      {state.error ?? state.success}
    </p>
  );
}

export function PmPaymentForms({ tenants, paystackEnabled }: PmPaymentFormsProps) {
  const [pendingState, pendingAction, pendingSubmitting] = useActionState<
    PmActionState,
    FormData
  >(createPendingPayment, null);
  const [manualState, manualAction, manualSubmitting] = useActionState<
    PmActionState,
    FormData
  >(recordManualPayment, null);

  return (
    <>
      <section className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <h2 className="font-display text-lg font-bold text-adab-navy-800">
          Create pending invoice (Paystack)
        </h2>
        <p className="mt-1 text-xs text-adab-gray-500">
          {paystackEnabled
            ? "Tenant will see a Pay online button on their dashboard."
            : "Paystack keys are not set — invoice is stored as pending only."}
        </p>
        <form action={pendingAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="portal-label" htmlFor="pending_tenant_id">
              Tenant
            </label>
            <select
              className="portal-select"
              id="pending_tenant_id"
              name="tenant_id"
              required
            >
              <option value="">Select tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="portal-label" htmlFor="pending_amount_ngn">
              Amount (NGN)
            </label>
            <input
              className="portal-input"
              id="pending_amount_ngn"
              name="amount_ngn"
              type="number"
              min={1}
              required
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="pending_payment_type">
              Type
            </label>
            <select
              className="portal-select"
              id="pending_payment_type"
              name="payment_type"
            >
              <option value="rent">Rent</option>
              <option value="deposit">Deposit</option>
              <option value="service_charge">Service charge</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="portal-label" htmlFor="pending_notes">
              Notes
            </label>
            <input className="portal-input" id="pending_notes" name="notes" />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pendingSubmitting}
              className="rounded-full bg-adab-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700 disabled:opacity-50"
            >
              {pendingSubmitting ? "Creating…" : "Create pending invoice"}
            </button>
            <ActionFeedback state={pendingState} />
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <h2 className="font-display text-lg font-bold text-adab-navy-800">
          Record manual payment
        </h2>
        <form action={manualAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="portal-label" htmlFor="tenant_id">
              Tenant
            </label>
            <select className="portal-select" id="tenant_id" name="tenant_id" required>
              <option value="">Select tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.label}
                </option>
              ))}
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
              disabled={manualSubmitting}
              className="rounded-full bg-adab-gold-500 px-5 py-2.5 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
            >
              {manualSubmitting ? "Saving…" : "Record payment"}
            </button>
            <ActionFeedback state={manualState} />
          </div>
        </form>
      </section>
    </>
  );
}
