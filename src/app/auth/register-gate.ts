"use server";

import { isDisposableEmail } from "@/lib/security/disposable-emails";
import { guardPublicForm } from "@/lib/security/form-guard";

export type RegistrationGateState = { error?: string } | null;

export async function validateRegistrationGate(
  formData: FormData,
): Promise<RegistrationGateState> {
  const guard = await guardPublicForm(formData, {
    rateLimitKey: "register",
    rateLimit: 5,
  });
  if (!guard.ok) {
    return { error: guard.error };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (isDisposableEmail(email)) {
    return { error: "Please use a permanent email address (no disposable mail)." };
  }

  return null;
}
