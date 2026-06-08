import { siteConfig } from "@/lib/site-config";

export type ListingApprovedEmailParams = {
  to: string;
  listerName: string;
  propertyTitle: string;
  propertySlug: string;
};

export type SendListingApprovedResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

function buildListingUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website;
  return `${base.replace(/\/$/, "")}/properties/${slug}`;
}

function buildEmailContent(params: ListingApprovedEmailParams) {
  const listingUrl = buildListingUrl(params.propertySlug);
  const greeting = params.listerName ? `Hi ${params.listerName},` : "Hi,";

  const shareText = `Check out this property on Adab: ${params.propertyTitle} — ${listingUrl}`;

  const text = `${greeting}

Great news — your property listing "${params.propertyTitle}" has been approved and is now live on adab.ng.

View and share your listing:
${listingUrl}

Share message:
${shareText}

Thank you for listing with ${siteConfig.name}.

— ${siteConfig.name}
${siteConfig.email}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1B2A4A; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="margin: 0 0 16px;">${greeting}</p>
  <p style="margin: 0 0 16px;">Great news — your property listing <strong>${escapeHtml(params.propertyTitle)}</strong> has been approved and is now live on <a href="https://adab.ng" style="color: #C9A227;">adab.ng</a>.</p>
  <p style="margin: 0 0 8px; font-weight: 600;">Your public listing</p>
  <p style="margin: 0 0 24px;"><a href="${listingUrl}" style="color: #1B2A4A; font-weight: 600;">${listingUrl}</a></p>
  <div style="background: #f8f6f1; border-left: 4px solid #C9A227; padding: 16px; margin: 0 0 24px;">
    <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Share with buyers &amp; tenants</p>
    <p style="margin: 0; font-size: 14px;">${escapeHtml(shareText)}</p>
  </div>
  <p style="margin: 0; font-size: 14px; color: #6b7280;">Thank you for listing with ${escapeHtml(siteConfig.name)}.</p>
</body>
</html>`;

  return { listingUrl, text, html, subject: `Your listing is live: ${params.propertyTitle}` };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendListingApprovedEmail(
  params: ListingApprovedEmailParams,
): Promise<SendListingApprovedResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? `Adab Real Estate <${siteConfig.email}>`;

  const { subject, text, html } = buildEmailContent(params);

  if (!apiKey) {
    console.info(
      "[listing-approved-email] RESEND_API_KEY not set — email not sent.",
      {
        to: params.to,
        propertyTitle: params.propertyTitle,
        propertySlug: params.propertySlug,
        subject,
        preview: text.slice(0, 200),
      },
    );
    return { sent: false, skipped: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[listing-approved-email] Resend error:", response.status, body);
      return { sent: false, error: `Resend returned ${response.status}` };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[listing-approved-email] Failed to send:", message);
    return { sent: false, error: message };
  }
}
