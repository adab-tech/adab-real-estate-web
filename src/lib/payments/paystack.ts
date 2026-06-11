import { createHmac } from "crypto";

export type PaystackInitParams = {
  email: string;
  amountNgn: number;
  reference: string;
  metadata?: Record<string, string>;
};

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function getPaystackPublicKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ??
    process.env.PAYSTACK_PUBLIC_KEY ??
    null
  );
}

export function generatePaystackReference(prefix = "adab_rent"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function initPaystackTransaction(
  params: PaystackInitParams,
): Promise<{ checkoutUrl: string | null; reference: string }> {
  const reference = params.reference || generatePaystackReference();

  if (!isPaystackConfigured()) {
    return { checkoutUrl: null, reference };
  }

  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng";

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNgn * 100),
      reference,
      currency: "NGN",
      metadata: params.metadata ?? {},
      callback_url: `${siteUrl}/tenant/dashboard?payment=success`,
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

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export type PaystackWebhookEvent = {
  event: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    metadata?: Record<string, string>;
  };
};
