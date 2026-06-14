"use server";

import { revalidatePath } from "next/cache";
import { sendAdminApplicationAlert } from "@/lib/email/admin-alert";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { guardPublicForm } from "@/lib/security/form-guard";
import { ensureTenantProfile, requireTenantUser } from "@/lib/tenant/profile";
import type { RentalApplicationData } from "@/types/tenant";

export type ApplicationFormState = { error?: string; success?: string } | null;

export async function submitRentalApplication(
  _prev: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const guard = await guardPublicForm(formData, {
    rateLimitKey: "rental-application",
    rateLimit: 5,
  });
  if (!guard.ok) {
    return { error: guard.error };
  }

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

  const extraDetails = {
    current_address: form_data.current_address,
    desired_move_in_date: form_data.desired_move_in_date,
    employment_status: form_data.employment_status,
    monthly_income_ngn: form_data.monthly_income_ngn,
    employer: form_data.employer,
    references: form_data.references,
    notes: form_data.notes,
  };

  const supabase = await createSupabaseAuthClient();
  const profileResult = await ensureTenantProfile(supabase, session.user);
  if (profileResult.error) {
    return { error: profileResult.error };
  }

  const { error } = await supabase.from("pm_applications").insert({
    applicant_id: session.user.id,
    application_type: "rental",
    full_name: fullName,
    email,
    phone,
    property_interest: form_data.property_slug ?? null,
    message: JSON.stringify(extraDetails),
    status: "submitted",
  });

  if (error) return { error: error.message };

  void sendAdminApplicationAlert({
    fullName,
    email,
    phone,
    propertySlug: form_data.property_slug ?? null,
  }).catch((err) => {
    console.error("[submitRentalApplication] admin alert failed:", err);
  });

  revalidatePath("/tenant/dashboard");
  revalidatePath("/admin/applications");
  return {
    success:
      "Rental application submitted. Our team will review it and contact you shortly.",
  };
}
