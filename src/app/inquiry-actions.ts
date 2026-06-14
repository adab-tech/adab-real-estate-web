"use server";

import { sendAdminInquiryAlert } from "@/lib/email/admin-alert";
import { sendInquiryConfirmationEmail } from "@/lib/email/inquiry-received";
import { guardPublicForm } from "@/lib/security/form-guard";
import { inquirySchema } from "@/lib/validations/inquiry";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type InquiryFormState = { error?: string; success?: string } | null;

export async function submitInquiry(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const guard = await guardPublicForm(formData, {
    rateLimitKey: "inquiry",
    rateLimit: 8,
  });
  if (!guard.ok) {
    return { error: guard.error };
  }

  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    propertyId: formData.get("propertyId") || undefined,
    propertySlug: formData.get("propertySlug") || undefined,
    source: formData.get("source") || "contact",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid form data.";
    return { error: first };
  }

  const data = parsed.data;
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("inquiries").insert({
      property_id: data.propertyId ?? null,
      property_slug: data.propertySlug ?? null,
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      message: data.message,
      source: data.source,
    });

    if (error) {
      console.error("[submitInquiry] DB insert failed:", error.message);
    }
  }

  if (data.email) {
    void sendInquiryConfirmationEmail({
      to: data.email,
      name: data.name,
      propertySlug: data.propertySlug,
    }).catch((err) => {
      console.error("[submitInquiry] confirmation email failed:", err);
    });
  }

  void sendAdminInquiryAlert({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    source: data.source,
    propertySlug: data.propertySlug,
  }).catch((err) => {
    console.error("[submitInquiry] admin alert failed:", err);
  });

  return { success: "Inquiry received. Opening WhatsApp…" };
}
