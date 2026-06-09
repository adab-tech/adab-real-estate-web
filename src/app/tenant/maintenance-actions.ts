"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { requireTenantUser } from "@/lib/tenant/profile";
import type { MaintenanceCategory, MaintenancePriority } from "@/types/tenant";

export type MaintenanceFormState = { error?: string; success?: string } | null;

const VALID_CATEGORIES = new Set<MaintenanceCategory>([
  "general",
  "plumbing",
  "electrical",
  "hvac",
  "structural",
  "pest",
  "other",
]);

const VALID_PRIORITIES = new Set<MaintenancePriority>([
  "low",
  "normal",
  "high",
  "emergency",
]);

export async function submitMaintenanceRequest(
  _prev: MaintenanceFormState,
  formData: FormData,
): Promise<MaintenanceFormState> {
  const session = await requireTenantUser();
  if (!session?.verified) {
    return { error: "Please sign in to submit a maintenance request." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "general") as MaintenanceCategory;
  const priority = String(formData.get("priority") ?? "normal") as MaintenancePriority;

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  if (!VALID_CATEGORIES.has(category)) {
    return { error: "Invalid category selected." };
  }

  if (!VALID_PRIORITIES.has(priority)) {
    return { error: "Invalid priority selected." };
  }

  const photoRaw = String(formData.get("photo_urls") ?? "").trim();
  const photo_urls = photoRaw
    ? photoRaw
        .split(/[\n,]+/)
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.from("maintenance_requests").insert({
    tenant_id: session.user.id,
    title,
    description,
    category,
    priority,
    photo_urls,
    status: "open",
  });

  if (error) return { error: error.message };

  revalidatePath("/tenant/dashboard");
  revalidatePath("/admin/maintenance");
  return {
    success:
      "Maintenance request submitted. You can track its status from your dashboard.",
  };
}
