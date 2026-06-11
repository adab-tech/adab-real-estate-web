import {
  createSupabaseAuthClient,
  resolveAdminSession,
} from "@/lib/supabase/auth-server";

export type PortalProfile = {
  role: "lister" | "admin";
  full_name: string | null;
};

export async function getPortalProfile(
  userId: string,
): Promise<PortalProfile | null> {
  const supabase = await createSupabaseAuthClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as PortalProfile;
}

export async function requirePortalUser() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!user.email_confirmed_at) return { user, verified: false as const };

  const profile = await getPortalProfile(user.id);
  return { user, profile, verified: true as const, supabase };
}

export async function requirePortalAdmin() {
  const adminSession = await resolveAdminSession();
  if (adminSession) {
    const profile = await getPortalProfile(adminSession.user.id);
    return {
      user: adminSession.user,
      profile: profile ?? { role: "admin" as const, full_name: null },
      verified: true as const,
      supabase: adminSession.supabase,
    };
  }

  const session = await requirePortalUser();
  if (!session?.verified || session.profile?.role !== "admin") return null;
  return session;
}
