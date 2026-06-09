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
