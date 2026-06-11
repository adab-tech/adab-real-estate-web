import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Single site administrator — must match supabase/grant-full-admin.sql */
export const SITE_ADMIN_EMAIL = "hello@adab.ng";

export function hasAdminJwtRole(user: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): boolean {
  return (
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin"
  );
}

export function isDesignatedAdminEmail(
  email: string | null | undefined,
): boolean {
  return email?.toLowerCase() === SITE_ADMIN_EMAIL;
}

export async function hasProfileAdminRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

/** True when user has full admin authority (JWT metadata, profiles.role, or designated email). */
export async function isSiteAdmin(
  supabase: SupabaseClient,
  user: User,
): Promise<boolean> {
  if (hasAdminJwtRole(user)) return true;
  if (isDesignatedAdminEmail(user.email)) return true;
  return hasProfileAdminRole(supabase, user.id);
}
