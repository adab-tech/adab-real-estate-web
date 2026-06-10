"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  portalEmailRedirectTo,
  signUpWithBrowserClient,
} from "@/lib/auth/client-auth";

export function RegisterForm() {
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
    const companyName = String(formData.get("company_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const listerType = String(formData.get("lister_type") ?? "owner");

    if (!email || !password || !fullName) {
      setState({ error: "Name, email, and password are required." });
      setPending(false);
      return;
    }

    const result = await signUpWithBrowserClient({
      email,
      password,
      emailRedirectTo: portalEmailRedirectTo(),
      metadata: {
        full_name: fullName,
        company_name: companyName,
        phone,
        lister_type: listerType,
      },
    });

    setState(result);
    setPending(false);

    if (result?.success && !result.error) {
      router.push("/portal/verify-email");
    }
  }

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-3xl font-bold text-adab-navy-800">
        Create your lister account
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        For property owners, landlords, and third-party agencies. We&apos;ll
        email you a verification link to activate your account.
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
          <label className="portal-label" htmlFor="company_name">
            Company / agency name (optional)
          </label>
          <input
            className="portal-input"
            id="company_name"
            name="company_name"
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
          <label className="portal-label" htmlFor="lister_type">
            I am a
          </label>
          <select
            className="portal-select"
            id="lister_type"
            name="lister_type"
            required
            defaultValue="owner"
          >
            <option value="owner">Property owner</option>
            <option value="landlord">Landlord</option>
            <option value="agency">Third-party agency</option>
          </select>
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
            autoComplete="email"
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
            minLength={8}
            required
            autoComplete="new-password"
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
        <Link
          className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          href="/portal/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
