import { headers } from "next/headers";
import { isHoneypotTriggered } from "@/lib/security/honeypot";
import {
  checkRateLimit,
  rateLimitKeyFromHeaders,
} from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type FormGuardResult = { ok: true } | { ok: false; error: string };

export async function guardPublicForm(
  formData: FormData,
  options: {
    rateLimitKey: string;
    rateLimit?: number;
    requireTurnstile?: boolean;
  },
): Promise<FormGuardResult> {
  if (isHoneypotTriggered(formData)) {
    return { ok: false, error: "Invalid submission." };
  }

  const headerStore = await headers();
  const rl = await checkRateLimit(
    rateLimitKeyFromHeaders(headerStore, options.rateLimitKey),
    options.rateLimit ?? 8,
  );
  if (!rl.ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  if (options.requireTurnstile !== false) {
    const token = String(formData.get("cf-turnstile-response") ?? "");
    if (!(await verifyTurnstileToken(token))) {
      return { ok: false, error: "Verification failed. Please try again." };
    }
  }

  return { ok: true };
}
