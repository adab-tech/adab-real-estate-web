"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { requireTenantUser } from "@/lib/tenant/profile";
import type { RentalApplicationData } from "@/types/tenant";

export type ApplicationFormState = { error?: string; success?: string } | null;

export async function submitRentalApplication(
  _prev: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const session = await requireTenantUser();
  if (!session?.verified) {
    return { error: "Please sign in to submit an application." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!fullName || !phone || !email) {
    return { error: "Name, phone, and email are required." };
  }

  const monthlyIncomeRaw = String(formData.get("monthly_income_ngn") ?? "").trim();
  const monthlyIncome = monthlyIncomeRaw
    ? Number(monthlyIncomeRaw.replace(/,/g, ""))
    : undefined;

  const form_data: RentalApplicationData = {
    full_name: fullName,
    phone,
    email,
    current_address: String(formData.get("current_address") ?? "").trim() || undefined,
    desired_move_in_date:
      String(formData.get("desired_move_in_date") ?? "").trim() || undefined,
    employment_status:
      String(formData.get("employment_status") ?? "").trim() || undefined,
    monthly_income_ngn:
      monthlyIncome && !Number.isNaN(monthlyIncome) ? monthlyIncome : undefined,
    employer: String(formData.get("employer") ?? "").trim() || undefined,
    references: String(formData.get("references") ?? "").trim() || undefined,
    property_slug: String(formData.get("property_slug") ?? "").trim() || undefined,
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  };

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.from("tenant_applications").insert({
    tenant_id: session.user.id,
    application_type: "rental",
    property_slug: form_data.property_slug ?? null,
    status: "submitted",
    form_data,
  });

  if (error) return { error: error.message };

  revalidatePath("/tenant/dashboard");
  revalidatePath("/admin/applications");
  return {
    success:
      "Rental application submitted. Our team will review it and contact you shortly.",
  };
}
