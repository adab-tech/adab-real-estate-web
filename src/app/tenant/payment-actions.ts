"use server";

import {
  generatePaystackReference,
  initPaystackTransaction,
  isPaystackConfigured,
} from "@/lib/payments/paystack";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { requireTenantUser } from "@/lib/tenant/profile";

export type PayRentResult = { error?: string; checkoutUrl?: string };

export async function initiateRentPayment(
  paymentId: string,
): Promise<PayRentResult> {
  const session = await requireTenantUser();
  if (!session?.verified) {
    return { error: "Please sign in to pay rent." };
  }

  if (!isPaystackConfigured()) {
    return {
      error:
        "Online payments are not enabled yet. Contact Adab to pay by bank transfer.",
    };
  }

  const supabase = await createSupabaseAuthClient();
  const { data: payment, error: fetchError } = await supabase
    .from("rent_payments")
    .select("id, tenant_id, amount_ngn, status, payment_type, paystack_reference")
    .eq("id", paymentId)
    .eq("tenant_id", session.user.id)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!payment) return { error: "Payment not found." };
  if (payment.status !== "pending") {
    return { error: "This payment is no longer pending." };
  }

  const email = session.user.email?.trim() ?? "";
  if (!email) {
    return { error: "Add an email to your profile before paying online." };
  }

  const reference =
    payment.paystack_reference?.trim() || generatePaystackReference();

  const { checkoutUrl, reference: finalRef } = await initPaystackTransaction({
    email,
    amountNgn: Number(payment.amount_ngn),
    reference,
    metadata: {
      payment_id: payment.id,
      tenant_id: session.user.id,
      payment_type: payment.payment_type,
    },
  });

  if (!checkoutUrl) {
    return { error: "Could not start Paystack checkout. Try again shortly." };
  }

  const serviceClient = getSupabaseServerClient();
  if (serviceClient && finalRef !== payment.paystack_reference) {
    const { error: updateError } = await serviceClient
      .from("rent_payments")
      .update({ paystack_reference: finalRef })
      .eq("id", payment.id)
      .eq("tenant_id", session.user.id)
      .eq("status", "pending");

    if (updateError) {
      console.error("[initiateRentPayment] reference update failed:", updateError.message);
    }
  }

  return { checkoutUrl };
}
