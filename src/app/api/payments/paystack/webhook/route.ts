import { NextResponse } from "next/server";
import {
  verifyPaystackSignature,
  type PaystackWebhookEvent,
} from "@/lib/payments/paystack";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  if (event.data?.status && event.data.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference?.trim();
  const paymentId = event.data?.metadata?.payment_id?.trim();
  if (!reference && !paymentId) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const paidAt = new Date().toISOString();
  const updates = { status: "paid", paid_at: paidAt };

  let updateError: string | null = null;

  if (reference) {
    const { error } = await supabase
      .from("rent_payments")
      .update(updates)
      .eq("paystack_reference", reference)
      .eq("status", "pending");

    if (error) updateError = error.message;
  }

  if (paymentId && !updateError) {
    const { error } = await supabase
      .from("rent_payments")
      .update({
        ...updates,
        paystack_reference: reference ?? null,
      })
      .eq("id", paymentId)
      .eq("status", "pending");

    if (error) updateError = error.message;
  }

  if (updateError) {
    console.error("[paystack webhook] update failed:", updateError);
    return NextResponse.json({ error: updateError }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
