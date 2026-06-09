"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInTenant } from "@/app/tenant/actions";

export function TenantLoginForm() {
  const [state, formAction, pending] = useActionState(signInTenant, null);

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-3xl font-bold text-adab-navy-800">
        Tenant sign in
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        Access your applications, maintenance requests, and lease documents.
      </p>

      {state?.error && (
        <div className="portal-alert portal-alert-error mt-6">{state.error}</div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="portal-label" htmlFor="email">
            Email
          </label>
          <input
            className="portal-input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="portal-label" htmlFor="password">
            Password
          </label>
          <input
            className="portal-input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className="portal-btn portal-btn-primary w-full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-adab-gray-500">
        No account?{" "}
        <Link href="/tenant/register" className="font-semibold text-adab-navy-800">
          Register as a tenant
        </Link>
      </p>
    </div>
  );
}
