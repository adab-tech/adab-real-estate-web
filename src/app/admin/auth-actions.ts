"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";

export type SignInState = { error?: string } | null;

export async function signInAdmin(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
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

  try {
    const supabase = await createSupabaseAuthClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }
  } catch {
    return { error: "Sign-in failed. Check site configuration and try again." };
  }

  redirect(destination);
}
