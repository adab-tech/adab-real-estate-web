import { sendResendEmail } from "@/lib/email/resend";
import { siteConfig } from "@/lib/site-config";

function adminAlertRecipient(): string {
  return process.env.ADMIN_ALERT_EMAIL ?? siteConfig.email;
}

export async function sendAdminInquiryAlert(input: {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  source: string;
  propertySlug?: string | null;
}): Promise<void> {
  const lines = [
    "New website inquiry",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    `Source: ${input.source}`,
    input.propertySlug ? `Property: ${input.propertySlug}` : null,
    "",
    input.message,
  ].filter(Boolean);

  await sendResendEmail({
    to: adminAlertRecipient(),
    subject: `New inquiry — ${input.name}`,
    text: lines.join("\n"),
    logTag: "admin-inquiry-alert",
  });
}

export async function sendAdminApplicationAlert(input: {
  fullName: string;
  email: string;
  phone: string;
  propertySlug?: string | null;
}): Promise<void> {
  const lines = [
    "New tenant rental application",
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    input.propertySlug ? `Property interest: ${input.propertySlug}` : null,
    "",
    "Review in admin: /admin/pm/applications",
  ].filter(Boolean);

  await sendResendEmail({
    to: adminAlertRecipient(),
    subject: `New rental application — ${input.fullName}`,
    text: lines.join("\n"),
    logTag: "admin-application-alert",
  });
}
