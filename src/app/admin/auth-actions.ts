"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import {
  checkRateLimit,
  rateLimitKeyFromHeaders,
} from "@/lib/security/rate-limit";

export type SignInState = { error?: string } | null;

export async function signInAdmin(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const headerStore = await headers();
  const rateLimit = await checkRateLimit(
    rateLimitKeyFromHeaders(headerStore, "admin-login"),
    10,
    "1 m",
  );
  if (!rateLimit.ok) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/properties");
  const destination =
    next.startsWith("/admin") && !next.startsWith("/admin/login")
      ? next
      : "/admin/properties";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let supabase;
  try {
    supabase = await createSupabaseAuthClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth is not configured.";
    return { error: message };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(destination);
}
