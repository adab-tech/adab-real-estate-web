import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureListerProfile(
  client: SupabaseClient,
  user: User,
): Promise<void> {
  const existing = await client
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  if (existing.data) return;

  const metadata = user.user_metadata ?? {};
  const insert = await client.from("profiles").insert({
    id: user.id,
    email: user.email ?? "",
    full_name: String(metadata.full_name ?? "").trim() || null,
    company_name: String(metadata.company_name ?? "").trim() || null,
    phone: String(metadata.phone ?? "").trim() || null,
    lister_type:
      metadata.lister_type === "landlord" ||
      metadata.lister_type === "agency"
        ? metadata.lister_type
        : "owner",
  });

  if (insert.error) {
    throw insert.error;
  }
}

export async function requirePortalSession(
  client: SupabaseClient,
): Promise<Session> {
  const session = await client.auth.getSession();
  if (!session.data.session) {
    throw new Error("Your session expired. Please sign in again.");
  }
  return session.data.session;
}
