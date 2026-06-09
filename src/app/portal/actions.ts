"use server";

import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
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

export async function signUpPortal(
  _prev: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const listerType = String(formData.get("lister_type") ?? "owner");

  if (!email || !password || !fullName) {
    return { error: "Name, email, and password are required." };
  }

  let supabase;
  try {
    supabase = await createSupabaseAuthClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Portal auth is not configured.";
    return { error: message };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website;
  const emailRedirectTo = `${siteUrl}/auth/callback?next=/portal/dashboard`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        company_name: companyName,
        phone,
        lister_type: listerType,
      },
    },
  });

  if (error) return { error: error.message };

  if (data.user && !data.user.email_confirmed_at) {
    return {
      success: `Account created. We sent a verification link to ${email}. Please confirm your email before signing in.`,
    };
  }

  redirect("/portal/dashboard");
}

export async function resendVerificationEmail(
  _prev: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };

  let supabase;
  try {
    supabase = await createSupabaseAuthClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Portal auth is not configured.";
    return { error: message };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website;
  const emailRedirectTo = `${siteUrl}/auth/callback?next=/portal/dashboard`;

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  if (error) return { error: error.message };
  return { success: "Verification email sent. Check your inbox." };
}

export async function signOutPortal() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
