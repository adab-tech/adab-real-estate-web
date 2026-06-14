import { sendResendEmail } from "@/lib/email/resend";
import { siteConfig } from "@/lib/site-config";

export async function sendInquiryConfirmationEmail(input: {
  to: string;
  name: string;
  propertySlug?: string;
}): Promise<{ sent: boolean }> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website).replace(
    /\/$/,
    "",
  );
  const propertyLine = input.propertySlug
    ? `\nProperty: ${siteUrl}/properties/${input.propertySlug}`
    : "";

  const result = await sendResendEmail({
    to: input.to,
    subject: "We received your inquiry — Adab Real Estate",
    text: `Hi ${input.name},

Thank you for contacting Adab Real Estate. We have received your inquiry and a member of our team will respond shortly.${propertyLine}

WhatsApp: ${siteConfig.whatsapp}
Email: ${siteConfig.email}

— ${siteConfig.name}`,
    logTag: "inquiry-received-email",
  });

  return { sent: result.sent };
}
