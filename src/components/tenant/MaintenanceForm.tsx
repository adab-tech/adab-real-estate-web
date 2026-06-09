"use client";

import { useActionState } from "react";
import { submitMaintenanceRequest } from "@/app/tenant/actions";

export function MaintenanceForm() {
  const [state, formAction, pending] = useActionState(
    submitMaintenanceRequest,
    null,
  );

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
          <label className="portal-label" htmlFor="title">
            Issue title
          </label>
          <input
            className="portal-input"
            id="title"
            name="title"
            required
            placeholder="e.g. Leaking kitchen tap"
          />
        </div>

        <div>
          <label className="portal-label" htmlFor="priority">
            Priority
          </label>
          <select
            className="portal-select"
            id="priority"
            name="priority"
            defaultValue="normal"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="portal-label" htmlFor="description">
            Description
          </label>
          <textarea
            className="portal-textarea min-h-32"
            id="description"
            name="description"
            required
            placeholder="Describe the issue and when it started…"
          />
        </div>

        <button
          className="portal-btn portal-btn-primary w-full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting…" : "Submit maintenance request"}
        </button>
      </form>
    </div>
  );
}
