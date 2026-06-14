"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitRentalApplication } from "@/app/tenant/application-actions";

type RentalApplicationFormProps = {
  defaultEmail?: string;
  defaultName?: string;
  defaultPhone?: string;
  propertySlug?: string;
};

export function RentalApplicationForm({
  defaultEmail = "",
  defaultName = "",
  defaultPhone = "",
  propertySlug = "",
}: RentalApplicationFormProps) {
  const [state, formAction, pending] = useActionState(submitRentalApplication, null);

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-2xl font-bold text-adab-navy-800">
        Rental application
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        Submit your details for review. KYC verification may be required before
        approval.
      </p>

      {state?.error && (
        <div className="portal-alert portal-alert-error mt-6">{state.error}</div>
      )}
      {state?.success && (
        <div className="portal-alert portal-alert-success mt-6">
          {state.success}{" "}
          <Link href="/tenant/dashboard" className="font-semibold underline">
            Back to dashboard
          </Link>
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="mt-6 space-y-4">
          <div className="grid gap-4 tablet:grid-cols-2">
            <div>
              <label className="portal-label" htmlFor="full_name">
                Full name
              </label>
              <input
                className="portal-input"
                id="full_name"
                name="full_name"
                defaultValue={defaultName}
                required
              />
            </div>
            <div>
              <label className="portal-label" htmlFor="phone">
                Phone
              </label>
              <input
                className="portal-input"
                id="phone"
                name="phone"
                type="tel"
                defaultValue={defaultPhone}
                required
              />
            </div>
          </div>

          <div>
            <label className="portal-label" htmlFor="email">
              Email
            </label>
            <input
              className="portal-input"
              id="email"
              name="email"
              type="email"
              defaultValue={defaultEmail}
              required
            />
          </div>

          <div>
            <label className="portal-label" htmlFor="property_slug">
              Property (slug, optional)
            </label>
            <input
              className="portal-input"
              id="property_slug"
              name="property_slug"
              placeholder="e.g. 2-bed-flat-maitama"
              defaultValue={propertySlug}
            />
          </div>

          <div>
            <label className="portal-label" htmlFor="current_address">
              Current address
            </label>
            <input className="portal-input" id="current_address" name="current_address" />
          </div>

          <div className="grid gap-4 tablet:grid-cols-2">
            <div>
              <label className="portal-label" htmlFor="desired_move_in_date">
                Desired move-in date
              </label>
              <input
                className="portal-input"
                id="desired_move_in_date"
                name="desired_move_in_date"
                type="date"
              />
            </div>
            <div>
              <label className="portal-label" htmlFor="employment_status">
                Employment status
              </label>
              <select className="portal-select" id="employment_status" name="employment_status">
                <option value="">Select…</option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 tablet:grid-cols-2">
            <div>
              <label className="portal-label" htmlFor="monthly_income_ngn">
                Monthly income (₦)
              </label>
              <input
                className="portal-input"
                id="monthly_income_ngn"
                name="monthly_income_ngn"
                type="number"
                min={0}
                step={10000}
              />
            </div>
            <div>
              <label className="portal-label" htmlFor="employer">
                Employer / business
              </label>
              <input className="portal-input" id="employer" name="employer" />
            </div>
          </div>

          <div>
            <label className="portal-label" htmlFor="references">
              References
            </label>
            <textarea
              className="portal-textarea min-h-20"
              id="references"
              name="references"
              placeholder="Previous landlord, employer, or guarantor contact details"
            />
          </div>

          <div>
            <label className="portal-label" htmlFor="notes">
              Additional notes
            </label>
            <textarea className="portal-textarea min-h-20" id="notes" name="notes" />
          </div>

          <button
            className="portal-btn portal-btn-primary"
            type="submit"
            disabled={pending}
          >
            {pending ? "Submitting…" : "Submit application"}
          </button>
        </form>
      )}
    </div>
  );
}
