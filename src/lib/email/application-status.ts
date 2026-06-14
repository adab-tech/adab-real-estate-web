import { sendResendEmail } from "@/lib/email/resend";
import { siteConfig } from "@/lib/site-config";

const STATUS_LABELS: Record<string, string> = {
  approved: "approved",
  rejected: "not approved at this time",
  reviewing: "under review",
};

export async function sendApplicationStatusEmail(input: {
  to: string;
  fullName: string;
  status: string;
  applicationType: string;
  adminNotes?: string | null;
}): Promise<{ sent: boolean }> {
  const statusLabel = STATUS_LABELS[input.status] ?? input.status;
  const typeLabel = input.applicationType.replace(/_/g, " ");
  const notesLine = input.adminNotes?.trim()
    ? `\n\nNotes from our team:\n${input.adminNotes.trim()}`
    : "";

  const result = await sendResendEmail({
    to: input.to,
    subject: `Your ${typeLabel} application update — Adab Real Estate`,
    text: `Hi ${input.fullName},

Your ${typeLabel} application status has been updated to: ${statusLabel}.${notesLine}

Sign in to your tenant dashboard: ${(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website).replace(/\/$/, "")}/tenant/dashboard

Questions? Reply to this email or contact us at ${siteConfig.email}.

— ${siteConfig.name}`,
    logTag: "application-status-email",
  });

  return { sent: result.sent };
}
