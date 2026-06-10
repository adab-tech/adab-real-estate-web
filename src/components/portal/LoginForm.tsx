"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { signInPortal } from "@/app/portal/actions";
import {
  portalEmailRedirectTo,
  resendVerificationWithBrowserClient,
} from "@/lib/auth/client-auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInPortal, null);
  const [resendState, setResendState] = useState<{
    error?: string;
    success?: string;
  } | null>(null);
  const [resendPending, setResendPending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state?.error?.includes("verify your email")) {
      setShowResend(true);
    }
  }, [state?.error]);

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResendPending(true);
    setResendState(null);

    const formData = new FormData(event.currentTarget);
    const resendEmail = String(formData.get("email") ?? email).trim();
    if (!resendEmail) {
      setResendState({ error: "Email is required." });
      setResendPending(false);
      return;
    }

    const result = await resendVerificationWithBrowserClient({
      email: resendEmail,
      emailRedirectTo: portalEmailRedirectTo(),
    });
    setResendState(result);
    setResendPending(false);
  }

  const error = state?.error;

  return (
    <div className="portal-card p-8">
      <h1 className="font-display text-3xl font-bold text-adab-navy-800">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-adab-gray-500">
        Access your lister dashboard with email and password. You must verify
        your email before signing in.
      </p>

      {error && (
        <div className="portal-alert portal-alert-error mt-6">{error}</div>
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
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
            autoComplete="current-password"
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

      {showResend && (
        <div className="mt-6 border-t border-adab-gray-300 pt-6">
          <p className="text-sm font-semibold text-adab-navy-800">
            Resend verification email
          </p>
          {resendState?.error && (
            <div className="portal-alert portal-alert-error mt-3">
              {resendState.error}
            </div>
          )}
          {resendState?.success && (
            <div className="portal-alert portal-alert-success mt-3">
              {resendState.success}
            </div>
          )}
          <form onSubmit={handleResend} className="mt-3 space-y-3">
            <input
              className="portal-input"
              name="email"
              type="email"
              required
              defaultValue={email}
            />
            <button
              className="portal-btn portal-btn-secondary w-full"
              type="submit"
              disabled={resendPending}
            >
              Resend email
            </button>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-adab-gray-500">
        No account?{" "}
        <Link
          className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          href="/portal/register"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
