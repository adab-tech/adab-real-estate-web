"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  portalEmailRedirectTo,
  resendVerificationWithBrowserClient,
  tenantEmailRedirectTo,
} from "@/lib/auth/client-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type VerifyEmailClientProps = {
  reason?: string;
  dashboardHref?: string;
  portalLabel?: string;
};

export function VerifyEmailClient({
  reason,
  dashboardHref = "/portal/dashboard",
}: VerifyEmailClientProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "verified" | "pending">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [resendState, setResendState] = useState<{
    error?: string;
    success?: string;
  } | null>(null);
  const [resendPending, setResendPending] = useState(false);

  const emailRedirectTo = dashboardHref.startsWith("/tenant")
    ? tenantEmailRedirectTo()
    : portalEmailRedirectTo();

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const code = searchParams.get("code");
    const errorCode = searchParams.get("error");
    const errorMessage = searchParams.get("message");

    if (errorCode) {
      setError(
        errorMessage ||
          "This verification link is invalid or has expired. Request a new one below.",
      );
      setStatus("pending");
      return;
    }

    if (code || (tokenHash && type)) {
      const params = new URLSearchParams();
      if (code) params.set("code", code);
      if (tokenHash) params.set("token_hash", tokenHash);
      if (type) params.set("type", type);
      params.set("next", dashboardHref);
      window.location.replace(`/auth/callback?${params.toString()}`);
      return;
    }

    async function checkSession() {
      try {
        const client = createSupabaseBrowserClient();
        const { data } = await client.auth.getSession();

        if (data.session?.user?.email_confirmed_at) {
          setStatus("verified");
          router.replace(dashboardHref);
          return;
        }

        if (reason === "confirm" || searchParams.get("reason") === "confirm") {
          setError(
            "Please verify your email. Check your inbox for the confirmation link.",
          );
        }

        setStatus("pending");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Verification failed. Try signing in to resend the email.",
        );
        setStatus("pending");
      }
    }

    checkSession();
  }, [router, searchParams, dashboardHref, reason]);

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResendPending(true);
    setResendState(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    if (!email) {
      setResendState({ error: "Email is required." });
      setResendPending(false);
      return;
    }

    const result = await resendVerificationWithBrowserClient({
      email,
      emailRedirectTo,
    });
    setResendState(result);
    setResendPending(false);
  }

  return (
    <div className="portal-card p-8">
      {status === "loading" && (
        <p className="text-sm text-adab-gray-500">Checking verification…</p>
      )}

      {status === "verified" && (
        <>
          <h2 className="font-display text-2xl font-bold text-adab-navy-800">
            Email verified
          </h2>
          <p className="mt-3 text-sm text-adab-gray-500">
            Your account is active. Taking you to your dashboard…
          </p>
          <Link
            className="portal-btn portal-btn-primary mt-6 inline-flex"
            href={dashboardHref}
          >
            Go to dashboard
          </Link>
        </>
      )}

      {status === "pending" && (
        <>
          <h2 className="font-display text-2xl font-bold text-adab-navy-800">
            Verify your email
          </h2>
          <p className="mt-3 text-sm text-adab-gray-500">
            We sent a confirmation link to your inbox. Open it in this browser
            to activate your account.
          </p>
        </>
      )}

      {error && (
        <div className="portal-alert portal-alert-error mt-6">{error}</div>
      )}

      <div className="mt-8 border-t border-adab-gray-300 pt-6">
        <p className="text-sm font-semibold text-adab-navy-800">
          Didn&apos;t receive the email?
        </p>
        <p className="mt-1 text-sm text-adab-gray-500">
          Enter your address and we&apos;ll send another verification link.
        </p>
        {resendState?.success && (
          <div className="portal-alert portal-alert-success mt-3">
            {resendState.success}
          </div>
        )}
        {resendState?.error && (
          <div className="portal-alert portal-alert-error mt-3">
            {resendState.error}
          </div>
        )}
        <form onSubmit={handleResend} className="mt-4 space-y-3">
          <input
            className="portal-input"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <button
            className="portal-btn portal-btn-secondary w-full"
            type="submit"
            disabled={resendPending}
          >
            Resend verification email
          </button>
        </form>
      </div>
    </div>
  );
}
