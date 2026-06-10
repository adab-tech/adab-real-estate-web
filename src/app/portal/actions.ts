"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";

export type PortalAuthState = { error?: string; success?: string } | null;

export async function signInPortal(
  _prev: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let supabase;
  try {
    supabase = await createSupabaseAuthClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Portal auth is not configured.";
    return { error: message };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    return {
      error: "Please verify your email before signing in.",
    };
  }

  redirect("/portal/dashboard");
}

export async function signOutPortal() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
