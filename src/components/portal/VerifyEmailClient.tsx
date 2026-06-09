"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { resendVerificationEmail, type PortalAuthState } from "@/app/portal/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type VerifyEmailClientProps = {
  reason?: string;
  dashboardHref?: string;
  resendAction?: (
    prev: PortalAuthState,
    formData: FormData,
  ) => Promise<PortalAuthState>;
  portalLabel?: string;
};

export function VerifyEmailClient({
  reason,
  dashboardHref = "/portal/dashboard",
  resendAction = resendVerificationEmail,
  portalLabel = "listing",
}: VerifyEmailClientProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "verified" | "pending">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [resendState, submitResend, resendPending] = useActionState(
    resendAction,
    null,
  );

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

    // PKCE code exchange must run on the server callback where verifier cookies are stored.
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
            We sent a confirmation link to your inbox. Open it to activate your
            account and start listing properties.
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
        <form action={submitResend} className="mt-4 space-y-3">
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
