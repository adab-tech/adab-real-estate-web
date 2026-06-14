"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitMaintenanceRequest } from "@/app/tenant/maintenance-actions";

export function MaintenanceRequestForm() {
  const [state, formAction, pending] = useActionState(submitMaintenanceRequest, null);

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-2xl font-bold text-adab-navy-800">
        Maintenance request
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        Report an issue at your property. Include photo URLs if available (file
        upload coming in a later release).
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
          <div>
            <label className="portal-label" htmlFor="title">
              Issue title
            </label>
            <input
              className="portal-input"
              id="title"
              name="title"
              placeholder="e.g. Leaking kitchen tap"
              required
            />
          </div>

          <div className="grid gap-4 tablet:grid-cols-2">
            <div>
              <label className="portal-label" htmlFor="category">
                Category
              </label>
              <select className="portal-select" id="category" name="category" defaultValue="general">
                <option value="general">General</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC / AC</option>
                <option value="structural">Structural</option>
                <option value="pest">Pest control</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="portal-label" htmlFor="priority">
                Priority
              </label>
              <select className="portal-select" id="priority" name="priority" defaultValue="normal">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="portal-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="portal-textarea min-h-28"
              id="description"
              name="description"
              placeholder="Describe the issue, location in the unit, and when it started."
              required
            />
          </div>

          <div>
            <label className="portal-label" htmlFor="photo_urls">
              Photo URLs (optional, one per line)
            </label>
            <textarea
              className="portal-textarea min-h-20"
              id="photo_urls"
              name="photo_urls"
              placeholder="https://…"
            />
          </div>

          <button
            className="portal-btn portal-btn-primary"
            type="submit"
            disabled={pending}
          >
            {pending ? "Submitting…" : "Submit request"}
          </button>
        </form>
      )}
    </div>
  );
}
