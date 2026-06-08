"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAdmin, type SignInState } from "@/app/admin/auth-actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");
  const next = searchParams.get("next") || "/admin/properties";

  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signInAdmin,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {queryError === "unauthorized" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Your account is not authorized for admin access.
        </p>
      )}
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={inputClass}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-adab-navy-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-adab-gray-300 px-4 py-3 text-sm outline-none focus:border-adab-gold-500";
