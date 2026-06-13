import { timingSafeEqual } from "crypto";

/**
 * Flutterwave integration — Phase 2 scaffold.
 * Checkout UI is not wired yet; webhook endpoint accepts verified events
 * and marks matching rent_payments rows as paid (tx_ref stored in paystack_reference until Phase 2).
 */

export function isFlutterwaveConfigured(): boolean {
  return Boolean(process.env.FLUTTERWAVE_SECRET_KEY);
}

export function getFlutterwavePublicKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ??
    process.env.FLUTTERWAVE_PUBLIC_KEY ??
    null
  );
}

export function generateFlutterwaveReference(prefix = "adab_rent"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Compare verif-hash header to FLUTTERWAVE_WEBHOOK_SECRET (dashboard secret hash). */
export function verifyFlutterwaveWebhookHash(
  verifHash: string | null,
): boolean {
  const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
  if (!secret || !verifHash) return false;
  if (secret.length !== verifHash.length) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(verifHash));
  } catch {
    return false;
  }
}

export type FlutterwaveWebhookEvent = {
  event?: string;
  data?: {
    tx_ref?: string;
    flw_ref?: string;
    status?: string;
    amount?: number;
    currency?: string;
    meta?: Record<string, string>;
  };
};
