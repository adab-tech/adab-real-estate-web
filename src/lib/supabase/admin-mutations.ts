import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Admin session plus a Supabase client for privileged writes.
 * Uses the service-role client when configured (bypasses RLS); otherwise falls back to the user JWT client.
 */
export async function requireAdminMutationClient(): Promise<{
  supabase: SupabaseClient;
  user: { id: string };
  usesServiceRole: boolean;
}> {
  const { user, supabase: authClient } = await requireAdmin();
  const serviceClient = getSupabaseServerClient();
  const usesServiceRole = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY && serviceClient,
  );

  return {
    supabase: usesServiceRole ? serviceClient! : authClient,
    user,
    usesServiceRole,
  };
}
