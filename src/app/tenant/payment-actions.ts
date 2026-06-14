"use server";

import {
  generateOpayReference,
  initOpayTransaction,
  isOpayConfigured,
} from "@/lib/payments/opay";
import {
  generatePaystackReference,
  initPaystackTransaction,
  isPaystackConfigured,
} from "@/lib/payments/paystack";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-server";
import { requireTenantUser } from "@/lib/tenant/profile";

export type PayRentResult = { error?: string; checkoutUrl?: string };
export type RentPaymentProvider = "paystack" | "opay";

export async function initiateRentPayment(
  paymentId: string,
  provider: RentPaymentProvider = "paystack",
): Promise<PayRentResult> {
  const session = await requireTenantUser();
  if (!session?.verified) {
    return { error: "Please sign in to pay rent." };
  }

  const paystackReady = isPaystackConfigured();
  const opayReady = isOpayConfigured();

  if (provider === "paystack" && !paystackReady) {
    return {
      error:
        "Paystack is not enabled. Try OPay or contact Adab to pay by bank transfer.",
    };
  }

  if (provider === "opay" && !opayReady) {
    return {
      error:
        "OPay is not enabled. Try Paystack or contact Adab to pay by bank transfer.",
    };
  }

  if (!paystackReady && !opayReady) {
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

  const metadata = {
    payment_id: payment.id,
    tenant_id: session.user.id,
    payment_type: payment.payment_type,
  };

  let checkoutUrl: string | null = null;
  let finalRef = payment.paystack_reference?.trim() ?? "";

  if (provider === "opay") {
    const reference = finalRef || generateOpayReference();
    const result = await initOpayTransaction({
      email,
      amountNgn: Number(payment.amount_ngn),
      reference,
      metadata,
    });
    checkoutUrl = result.checkoutUrl;
    finalRef = result.reference;
  } else {
    const reference = finalRef || generatePaystackReference();
    const result = await initPaystackTransaction({
      email,
      amountNgn: Number(payment.amount_ngn),
      reference,
      metadata,
    });
    checkoutUrl = result.checkoutUrl;
    finalRef = result.reference;
  }

  if (!checkoutUrl) {
    return {
      error:
        provider === "opay"
          ? "Could not start OPay checkout. Try again shortly."
          : "Could not start Paystack checkout. Try again shortly.",
    };
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
