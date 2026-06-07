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
}): boolean {
  return user.app_metadata?.role === "admin";
}

export async function requireAdmin() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect("/admin/login");
  }

  return { supabase, user };
}
