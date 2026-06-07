"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validations/inquiry";

export type InquiryState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const initialFieldErrors = undefined;

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    propertyId: formData.get("propertyId") || undefined,
    propertySlug: formData.get("propertySlug") || undefined,
    source: formData.get("source") || "contact",
  };

  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Inquiry service is not configured yet. Please contact us by phone or WhatsApp.",
      fieldErrors: initialFieldErrors,
    };
  }

  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    message: parsed.data.message,
    property_id: parsed.data.propertyId ?? null,
    property_slug: parsed.data.propertySlug ?? null,
    source: parsed.data.source,
  });

  if (error) {
    console.error("Inquiry insert failed:", error.message);
    return {
      success: false,
      message: "Something went wrong. Please try WhatsApp or call us directly.",
      fieldErrors: initialFieldErrors,
    };
  }

  return {
    success: true,
    message: "Thank you! Our team will contact you within one business day.",
    fieldErrors: initialFieldErrors,
  };
}
