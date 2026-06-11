import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function createSupabaseAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — middleware handles refresh.
        }
      },
    },
  });
}

export function isAdminUser(user: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): boolean {
  return (
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin"
  );
}

/** Resolves an admin session from JWT metadata or profiles.role. */
export async function resolveAdminSession() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  if (isAdminUser(user)) {
    return { supabase, user };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return null;

  return { supabase, user };
}

export async function requireAdmin() {
  const session = await resolveAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
