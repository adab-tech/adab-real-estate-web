import { NextResponse } from "next/server";
import {
  createSupabaseAuthClient,
  resolveAdminSession,
} from "@/lib/supabase/auth-server";

export async function requireAdminApi() {
  const session = await resolveAdminSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }
  return { session } as const;
}

export async function requirePortalApi() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  return { supabase, user } as const;
}
