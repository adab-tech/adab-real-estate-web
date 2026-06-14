import { NextResponse } from "next/server";
import {
  opayWebhookSuccessResponse,
  verifyOpayWebhookSignature,
  type OpayWebhookEvent,
} from "@/lib/payments/opay";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-opay-signature") ??
    request.headers.get("signature");

  if (!verifyOpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: OpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as OpayWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = event.payload ?? {};
  const reference = (payload.reference ?? event.reference)?.trim();
  const status = (payload.status ?? event.status)?.toUpperCase();
  const paymentId = payload.metadata?.payment_id?.trim();

  if (!reference && !paymentId) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  if (status && status !== "SUCCESS" && status !== "SUCCESSFUL") {
    return NextResponse.json(opayWebhookSuccessResponse());
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
    console.error("[opay webhook] update failed:", updateError);
    return NextResponse.json({ error: updateError }, { status: 500 });
  }

  return NextResponse.json(opayWebhookSuccessResponse());
}
