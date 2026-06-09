/**
 * Paystack integration stub — Phase 1.
 * Full checkout + webhooks documented in docs/TENANT-PORTAL-ROADMAP.md (Phase 2).
 */

export type PaystackInitParams = {
  email: string;
  amountNgn: number;
  reference: string;
  metadata?: Record<string, string>;
};

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function generatePaystackReference(prefix = "adab_rent"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Returns checkout URL when configured; otherwise null (manual payment flow). */
export async function initPaystackCheckout(
  params: PaystackInitParams,
): Promise<{ checkoutUrl: string | null; reference: string }> {
  const reference = params.reference || generatePaystackReference();

  if (!isPaystackConfigured()) {
    return { checkoutUrl: null, reference };
  }

  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountNgn * 100,
      reference,
      currency: "NGN",
      metadata: params.metadata ?? {},
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng"}/tenant/dashboard?payment=success`,
    }),
  });

  if (!res.ok) {
    console.error("Paystack init failed:", await res.text());
    return { checkoutUrl: null, reference };
  }

  const json = (await res.json()) as {
    data?: { authorization_url?: string };
  };

  return {
    checkoutUrl: json.data?.authorization_url ?? null,
    reference,
  };
}
