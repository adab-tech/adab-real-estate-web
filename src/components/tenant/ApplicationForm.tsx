"use client";

import { useActionState } from "react";
import { submitApplication } from "@/app/tenant/actions";
import type { ApplicationType } from "@/types/tenant-portal";
import { APPLICATION_TYPE_LABELS } from "@/types/tenant-portal";

type ApplicationFormProps = {
  defaultType?: ApplicationType;
  authenticated?: boolean;
};

export function ApplicationForm({
  defaultType = "rental",
  authenticated = false,
}: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(submitApplication, null);

  return (
    <div>
      {state?.error && (
        <div className="portal-alert portal-alert-error mb-4">{state.error}</div>
      )}
      {state?.success && (
        <div className="portal-alert portal-alert-success mb-4">
          {state.success}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="portal-label" htmlFor="application_type">
            Application type
          </label>
          <select
            className="portal-select"
            id="application_type"
            name="application_type"
            defaultValue={defaultType}
          >
            {(Object.keys(APPLICATION_TYPE_LABELS) as ApplicationType[]).map(
              (type) => (
                <option key={type} value={type}>
                  {APPLICATION_TYPE_LABELS[type]}
                </option>
              ),
            )}
          </select>
        </div>

        {!authenticated && (
          <>
            <div>
              <label className="portal-label" htmlFor="full_name">
                Full name
              </label>
              <input
                className="portal-input"
                id="full_name"
                name="full_name"
                required
              />
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
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="portal-label" htmlFor="property_interest">
            Property or area of interest
          </label>
          <input
            className="portal-input"
            id="property_interest"
            name="property_interest"
            placeholder="e.g. Lekki Phase 1, 3-bed apartment"
          />
        </div>

        <div>
          <label className="portal-label" htmlFor="message">
            Additional details
          </label>
          <textarea
            className="portal-textarea min-h-28"
            id="message"
            name="message"
            placeholder="Budget, move-in date, management needs, etc."
          />
        </div>

        <button
          className="portal-btn portal-btn-primary w-full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
