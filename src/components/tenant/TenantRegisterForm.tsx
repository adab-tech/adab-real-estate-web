"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpTenant } from "@/app/tenant/actions";

export function TenantRegisterForm() {
  const [state, formAction, pending] = useActionState(signUpTenant, null);

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-3xl font-bold text-adab-navy-800">
        Create your tenant account
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        For renters, buyers, and leaseholders. We&apos;ll email you a verification
        link to activate your account.
      </p>

      {state?.error && (
        <div className="portal-alert portal-alert-error mt-6">{state.error}</div>
      )}
      {state?.success && (
        <div className="portal-alert portal-alert-success mt-6">
          {state.success}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
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
          <label className="portal-label" htmlFor="phone">
            Phone
          </label>
          <input
            className="portal-input"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234"
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <button
          className="portal-btn portal-btn-primary w-full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-adab-gray-500">
        Already registered?{" "}
        <Link href="/tenant/login" className="font-semibold text-adab-navy-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}
