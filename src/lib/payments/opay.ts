import { createHmac, timingSafeEqual } from "crypto";

/**
 * OPay (Nigeria) integration scaffold — webhook + server init helpers.
 * Checkout can be wired from tenant flow when OPAY_* env vars are set.
 * Reference is stored in rent_payments.paystack_reference until a dedicated column exists.
 */

export type OpayInitParams = {
  email: string;
  amountNgn: number;
  reference: string;
  metadata?: Record<string, string>;
};

export function isOpayConfigured(): boolean {
  return Boolean(
    process.env.OPAY_MERCHANT_ID &&
      process.env.OPAY_PUBLIC_KEY &&
      process.env.OPAY_PRIVATE_KEY,
  );
}

export function getOpayPublicKey(): string | null {
  return process.env.OPAY_PUBLIC_KEY ?? null;
}

export function generateOpayReference(prefix = "adab_rent"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** HMAC-SHA512 sign for OPay API bodies (private key). */
export function signOpayPayload(payload: string): string | null {
  const privateKey = process.env.OPAY_PRIVATE_KEY;
  if (!privateKey) return null;
  return createHmac("sha512", privateKey).update(payload).digest("hex");
}

export function verifyOpayWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const expected = signOpayPayload(rawBody);
  if (!expected || !signature) return false;
  if (expected.length !== signature.length) return false;

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function initOpayTransaction(
  params: OpayInitParams,
): Promise<{ checkoutUrl: string | null; reference: string }> {
  const reference = params.reference || generateOpayReference();

  if (!isOpayConfigured()) {
    return { checkoutUrl: null, reference };
  }

  const merchantId = process.env.OPAY_MERCHANT_ID!;
  const publicKey = process.env.OPAY_PUBLIC_KEY!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adab.ng";

  const body = {
    amount: {
      currency: "NGN",
      total: Math.round(params.amountNgn * 100),
    },
    callbackUrl: `${siteUrl}/tenant/dashboard?payment=success`,
    cancelUrl: `${siteUrl}/tenant/dashboard?payment=cancelled`,
    country: "NG",
    expireAt: 30,
    payMethod: ["account", "bankCard", "bankTransfer", "ussd"],
    product: {
      description: "Adab rent payment",
      name: "Rent",
    },
    reference,
    returnUrl: `${siteUrl}/tenant/dashboard?payment=success`,
    userInfo: {
      userEmail: params.email,
      userName: params.email.split("@")[0] ?? "Tenant",
    },
    metadata: params.metadata ?? {},
  };

  const bodyStr = JSON.stringify(body);
  const signature = signOpayPayload(bodyStr);
  if (!signature) {
    return { checkoutUrl: null, reference };
  }

  const res = await fetch(
    "https://api.opaycheckout.com/api/v1/international/cashier/create",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey}`,
        MerchantId: merchantId,
        Signature: signature,
        "Content-Type": "application/json",
      },
      body: bodyStr,
    },
  );

  if (!res.ok) {
    console.error("OPay init failed:", await res.text());
    return { checkoutUrl: null, reference };
  }

  const json = (await res.json()) as {
    data?: { cashierUrl?: string; paymentUrl?: string };
  };

  const checkoutUrl =
    json.data?.cashierUrl ?? json.data?.paymentUrl ?? null;

  return { checkoutUrl, reference };
}

/** OPay expects this JSON body on successful webhook handling. */
export function opayWebhookSuccessResponse() {
  return { code: "00000", message: "SUCCESSFUL" } as const;
}

export type OpayWebhookEvent = {
  payload?: {
    reference?: string;
    status?: string;
    amount?: number;
    metadata?: Record<string, string>;
  };
  reference?: string;
  status?: string;
};
