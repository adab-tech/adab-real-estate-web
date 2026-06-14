"use server";

import { revalidatePath } from "next/cache";
import { sendApplicationStatusEmail } from "@/lib/email/application-status";
import { requireAdminMutationClient } from "@/lib/supabase/admin-mutations";
import { requireAdmin } from "@/lib/supabase/auth-server";

export type PmActionState = { error?: string; success?: string } | null;

export async function updateApplicationStatus(
  id: string,
  status: string,
  adminNotes?: string,
): Promise<PmActionState> {
  const { supabase, user } = await requireAdminMutationClient();

  const { data: existing } = await supabase
    .from("pm_applications")
    .select("id, full_name, email, application_type, status")
    .eq("id", id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("pm_applications")
    .update({
      status,
      admin_notes: adminNotes ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data || data.status !== status) {
    return {
      error:
        "Application update did not persist. Run supabase/fix-admin-approve-actions.sql in Supabase.",
    };
  }

  if (
    existing?.email &&
    (status === "approved" || status === "rejected" || status === "reviewing")
  ) {
    void sendApplicationStatusEmail({
      to: existing.email,
      fullName: existing.full_name ?? "Applicant",
      status,
      applicationType: existing.application_type ?? "application",
      adminNotes: adminNotes ?? null,
    }).catch((err) => {
      console.error("[updateApplicationStatus] status email failed:", err);
    });
  }

  revalidatePath("/admin/pm/applications");
  return { success: "Application updated." };
}

export async function updateMaintenanceStatus(
  id: string,
  status: string,
  assignedTo?: string,
  resolutionNotes?: string,
): Promise<PmActionState> {
  const { supabase } = await requireAdmin();

  const updates: Record<string, unknown> = { status };
  if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;
  if (resolutionNotes !== undefined) {
    updates.resolution_notes = resolutionNotes || null;
  }
  if (status === "resolved" || status === "closed") {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("maintenance_requests")
    .update(updates)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/maintenance");
  return { success: "Maintenance request updated." };
}

export async function updateLeaseStatus(
  id: string,
  status: string,
): Promise<PmActionState> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("leases")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/leases");
  return { success: "Lease updated." };
}

export async function updateAgreementStatus(
  id: string,
  status: string,
): Promise<PmActionState> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("management_agreements")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/leases");
  revalidatePath("/admin/pm/properties");
  return { success: "Agreement updated." };
}

export async function updateTenantKycStatus(
  id: string,
  kycStatus: string,
  kycNotes?: string,
): Promise<PmActionState> {
  const { supabase, user } = await requireAdmin();

  const updates: Record<string, unknown> = {
    kyc_status: kycStatus,
    kyc_notes: kycNotes ?? null,
  };

  if (kycStatus === "verified") {
    updates.verified_at = new Date().toISOString();
    updates.verified_by = user.id;
  }

  const { error } = await supabase
    .from("tenant_profiles")
    .update(updates)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/tenants");
  revalidatePath(`/admin/pm/tenants/${id}`);
  return { success: "KYC status updated." };
}

export async function recordManualPaymentForm(
  formData: FormData,
): Promise<void> {
  await recordManualPayment(null, formData);
}

export async function createPendingPaymentForm(
  formData: FormData,
): Promise<void> {
  await createPendingPayment(null, formData);
}

export async function createPendingPayment(
  _prev: PmActionState,
  formData: FormData,
): Promise<PmActionState> {
  const { supabase, user } = await requireAdmin();

  const tenantId = String(formData.get("tenant_id") ?? "").trim();
  const leaseId = String(formData.get("lease_id") ?? "").trim();
  const amountNgn = Number(formData.get("amount_ngn"));
  const paymentType = String(formData.get("payment_type") ?? "rent");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!tenantId || !amountNgn || amountNgn <= 0) {
    return { error: "Tenant and valid amount are required." };
  }

  const { error } = await supabase.from("rent_payments").insert({
    tenant_id: tenantId,
    lease_id: leaseId || null,
    amount_ngn: amountNgn,
    payment_type: paymentType,
    status: "pending",
    notes: notes || null,
    recorded_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/payments");
  revalidatePath("/tenant/dashboard");
  return { success: "Pending payment created. Tenant can pay online when Paystack is configured." };
}

export async function recordManualPayment(
  _prev: PmActionState,
  formData: FormData,
): Promise<PmActionState> {
  const { supabase, user } = await requireAdmin();

  const tenantId = String(formData.get("tenant_id") ?? "").trim();
  const leaseId = String(formData.get("lease_id") ?? "").trim();
  const amountNgn = Number(formData.get("amount_ngn"));
  const paymentType = String(formData.get("payment_type") ?? "rent");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!tenantId || !amountNgn || amountNgn <= 0) {
    return { error: "Tenant and valid amount are required." };
  }

  const { error } = await supabase.from("rent_payments").insert({
    tenant_id: tenantId,
    lease_id: leaseId || null,
    amount_ngn: amountNgn,
    payment_type: paymentType,
    status: "manual",
    paid_at: new Date().toISOString(),
    notes: notes || null,
    recorded_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/payments");
  return { success: "Payment recorded." };
}

export async function togglePropertyManagement(
  propertyId: string,
  underManagement: boolean,
): Promise<PmActionState> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("properties")
    .update({ under_management: underManagement })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/properties");
  return { success: "Property management flag updated." };
}
