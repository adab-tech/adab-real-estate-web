export const HONEYPOT_FIELD_NAME = "website";

export function isHoneypotTriggered(formData: FormData): boolean {
  const value = String(formData.get(HONEYPOT_FIELD_NAME) ?? "").trim();
  return value.length > 0;
}
