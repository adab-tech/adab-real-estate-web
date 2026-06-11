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

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const { error } = await supabase
    .from("rent_payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("paystack_reference", reference);

  if (error) {
    console.error("[paystack webhook] update failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
