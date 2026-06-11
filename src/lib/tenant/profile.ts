import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";

export type TenantProfile = {
  role: "tenant" | "admin" | "lister";
  full_name: string | null;
  phone: string | null;
  kyc_status: string;
};

export async function getTenantProfile(
  userId: string,
): Promise<TenantProfile | null> {
  const supabase = await createSupabaseAuthClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role, full_name, phone, kyc_status")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as TenantProfile;
}

export async function requireTenantUser() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!user.email_confirmed_at) return { user, verified: false as const };

  const profile = await getTenantProfile(user.id);
  if (profile?.role !== "tenant" && profile?.role !== "admin") {
    return null;
  }

  return { user, profile, verified: true as const, supabase };
}

/** Ensures auth.users row has a matching profiles row (fixes FK on pm_applications). */
export async function ensureTenantProfile(
  supabase: SupabaseClient,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
): Promise<{ error?: string }> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return {};

  const meta = user.user_metadata ?? {};
  const portalRole = String(meta.portal_role ?? "tenant");
  const role =
    portalRole === "client" || portalRole === "tenant" ? portalRole : "tenant";

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email ?? "",
    full_name: String(meta.full_name ?? ""),
    phone: (meta.phone as string | undefined) ?? null,
    lister_type: null,
    role,
  });

  if (error) return { error: error.message };
  return {};
}
