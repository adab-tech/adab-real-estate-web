"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { ensureTenantProfile } from "@/lib/tenant/profile";
import type { ApplicationType } from "@/types/tenant-portal";

export type TenantAuthState = { error?: string; success?: string } | null;

const APPLICATION_TYPES: ApplicationType[] = [
  "rental",
  "management_onboarding",
  "land_purchase",
];

export async function signInTenant(
  _prev: TenantAuthState,
  formData: FormData,
): Promise<TenantAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    return { error: "Please verify your email before signing in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user!.id)
    .maybeSingle();

  if (!profile || !["tenant", "client"].includes(profile.role)) {
    await supabase.auth.signOut();
    return {
      error:
        "This account is not registered as a tenant. Use the lister portal or register a tenant account.",
    };
  }

  redirect("/tenant/dashboard");
}

export async function signOutTenant() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/tenant");
}

export async function submitApplication(
  _prev: TenantAuthState,
  formData: FormData,
): Promise<TenantAuthState> {
  const applicationType = String(
    formData.get("application_type") ?? "rental",
  ) as ApplicationType;

  if (!APPLICATION_TYPES.includes(applicationType)) {
    return { error: "Invalid application type." };
  }

  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = String(formData.get("full_name") ?? "").trim();
  let email = String(formData.get("email") ?? "").trim();
  let phone = String(formData.get("phone") ?? "").trim();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, phone, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && ["tenant", "client"].includes(profile.role)) {
      fullName = fullName || profile.full_name || "";
      email = email || profile.email || user.email || "";
      phone = phone || profile.phone || "";
    }
  }

  if (!fullName || !email || !phone) {
    return { error: "Name, email, and phone are required." };
  }

  if (user) {
    const profileResult = await ensureTenantProfile(supabase, user);
    if (profileResult.error) {
      return { error: profileResult.error };
    }
  }

  const propertyInterest = String(formData.get("property_interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const { error } = await supabase.from("pm_applications").insert({
    applicant_id: user?.id ?? null,
    application_type: applicationType,
    full_name: fullName,
    email,
    phone,
    property_interest: propertyInterest || null,
    message: message || null,
    status: "submitted",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/applications");
  return {
    success:
      "Application submitted. Our team will review it and contact you within one business day.",
  };
}

export async function submitMaintenanceRequest(
  _prev: TenantAuthState,
  formData: FormData,
): Promise<TenantAuthState> {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to submit a maintenance request." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "normal");

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  const { error } = await supabase.from("maintenance_requests").insert({
    tenant_id: user.id,
    title,
    description,
    priority,
    status: "open",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/pm/maintenance");
  revalidatePath("/tenant/dashboard");
  return {
    success: "Maintenance request submitted. You can track status in your dashboard.",
  };
}
