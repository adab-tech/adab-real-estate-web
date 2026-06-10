"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  signUpWithBrowserClient,
  tenantEmailRedirectTo,
} from "@/lib/auth/client-auth";

export function TenantRegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<{ error?: string; success?: string } | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!email || !password || !fullName) {
      setState({ error: "Name, email, and password are required." });
      setPending(false);
      return;
    }

    const result = await signUpWithBrowserClient({
      email,
      password,
      emailRedirectTo: tenantEmailRedirectTo(),
      metadata: {
        full_name: fullName,
        phone,
        portal_role: "tenant",
      },
    });

    setState(result);
    setPending(false);

    if (result?.success && !result.error) {
      router.push("/tenant/verify-email");
    }
  }

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

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
