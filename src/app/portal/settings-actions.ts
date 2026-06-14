"use server";

import { revalidatePath } from "next/cache";
import {
  canChangeUsername,
  normalizeUsername,
  validateUsername,
} from "@/lib/lister/username";
import { requirePortalUser } from "@/lib/portal/profile";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";

export type UsernameFormState = { error?: string; success?: string } | null;

export async function updatePublicUsername(
  _prev: UsernameFormState,
  formData: FormData,
): Promise<UsernameFormState> {
  const session = await requirePortalUser();
  if (!session) return { error: "Please sign in again." };
  if (!session.verified) return { error: "Verify your email first." };

  const raw = String(formData.get("public_username") ?? "");
  const normalized = normalizeUsername(raw);
  const validationError = validateUsername(normalized);
  if (validationError) return { error: validationError };

  const supabase = await createSupabaseAuthClient();
  const { data: current, error: fetchError } = await supabase
    .from("profiles")
    .select("public_username, username_changed_at")
    .eq("id", session.user.id)
    .maybeSingle();

  if (fetchError || !current) {
    return { error: "Could not load your profile." };
  }

  if (
    current.public_username &&
    current.public_username !== normalized &&
    !canChangeUsername(current.username_changed_at)
  ) {
    return {
      error: `You can change your username again after the cooldown period (30 days).`,
    };
  }

  if (current.public_username === normalized) {
    return { success: "Username unchanged." };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      public_username: normalized,
      username_changed_at: new Date().toISOString(),
    })
    .eq("id", session.user.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "That username is already taken. Try another." };
    }
    if (updateError.code === "23514") {
      return { error: "Username format is invalid." };
    }
    return { error: updateError.message };
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/settings");
  revalidatePath(`/l/${normalized}`);

  return { success: "Public profile link updated." };
}
