"use client";

import { siteConfig } from "@/lib/site-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type AuthClientState = { error?: string; success?: string } | null;

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website;
}

export function portalEmailRedirectTo(): string {
  return `${getSiteUrl()}/auth/callback?next=/portal/dashboard`;
}

export function tenantEmailRedirectTo(): string {
  return `${getSiteUrl()}/auth/callback?next=/tenant/dashboard`;
}

export async function signUpWithBrowserClient(options: {
  email: string;
  password: string;
  emailRedirectTo: string;
  metadata?: Record<string, string>;
}): Promise<AuthClientState> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.auth.signUp({
    email: options.email,
    password: options.password,
    options: {
      emailRedirectTo: options.emailRedirectTo,
      data: options.metadata,
    },
  });

  if (error) return { error: error.message };

  if (data.user && !data.user.email_confirmed_at) {
    return {
      success: `Account created. We sent a verification link to ${options.email}. Please confirm your email before signing in.`,
    };
  }

  return { success: "Account created." };
}

export async function resendVerificationWithBrowserClient(options: {
  email: string;
  emailRedirectTo: string;
}): Promise<AuthClientState> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: options.email,
    options: { emailRedirectTo: options.emailRedirectTo },
  });

  if (error) return { error: error.message };
  return { success: "Verification email sent. Check your inbox." };
}
