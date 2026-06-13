import { NextResponse } from "next/server";
import {
  verifyFlutterwaveWebhookHash,
  type FlutterwaveWebhookEvent,
} from "@/lib/payments/flutterwave";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const verifHash = request.headers.get("verif-hash");

  if (!verifyFlutterwaveWebhookHash(verifHash)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: FlutterwaveWebhookEvent;
  try {
    event = JSON.parse(rawBody) as FlutterwaveWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.completed") {
    return NextResponse.json({ received: true });
  }

  const txRef = event.data?.tx_ref;
  const status = event.data?.status?.toLowerCase();

  if (!txRef || status !== "successful") {
    return NextResponse.json({ received: true });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  // Phase 2: store tx_ref in paystack_reference until a dedicated column exists.
  const { error } = await supabase
    .from("rent_payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("paystack_reference", txRef);

  if (error) {
    console.error("[flutterwave webhook] update failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
