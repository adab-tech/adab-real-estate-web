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

const BRAND = {
  navy: "#1B2A4A",
  gold: "#C9A227",
  cream: "#F8F6F1",
  gray: "#6B7280",
  white: "#FFFFFF",
} as const;

const CAC_REGISTRATION = "RC 9590252";

function getSiteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website).replace(
    /\/$/,
    "",
  );
}

function buildListingUrl(slug: string): string {
  return `${getSiteBase()}/properties/${slug}`;
}

function buildLogoUrl(): string {
  return `${getSiteBase()}/brand/logo.png`;
}

function buildCacLogoUrl(): string {
  return `${getSiteBase()}/brand/cac-logo.png`;
}

function buildWhatsAppShareUrl(shareText: string): string {
  return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailContent(params: ListingApprovedEmailParams) {
  const listingUrl = buildListingUrl(params.propertySlug);
  const logoUrl = buildLogoUrl();
  const cacLogoUrl = buildCacLogoUrl();
  const displayName = params.listerName.trim() || "there";
  const greeting =
    params.listerName.trim() ? `Dear ${params.listerName.trim()},` : "Dear Lister,";

  const shareText = `View this property on Adab.ng: ${params.propertyTitle} — ${listingUrl}`;
  const whatsAppShareUrl = buildWhatsAppShareUrl(shareText);

  const subject = `Your property is now live on Adab.ng — ${params.propertyTitle}`;

  const text = `${greeting}

Congratulations — your property listing "${params.propertyTitle}" has been reviewed and approved by the Adab Real Estate Agency team. It is now published and visible to buyers and tenants across Nigeria on adab.ng.

Your public listing:
${listingUrl}

Share your listing:
WhatsApp: ${whatsAppShareUrl}

Copy link: ${listingUrl}

We are proud to represent quality properties like yours. If you need photography updates, pricing guidance, or help responding to enquiries, our team is here for you.

Warm regards,

${siteConfig.name}
${siteConfig.tagline}

${siteConfig.email}
${siteConfig.phone}
${siteConfig.website}

CAC Reg. No. ${CAC_REGISTRATION}
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:Georgia,'Times New Roman',Times,serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:${BRAND.white};border:1px solid #e8e4dc;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.navy};padding:28px 32px;text-align:center;">
              <img src="${logoUrl}" alt="${escapeHtml(siteConfig.name)}" width="180" height="48" style="display:block;margin:0 auto 12px;max-width:180px;height:auto;border:0;" />
              <p style="margin:0;font-size:13px;line-height:1.5;color:${BRAND.gold};letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(siteConfig.tagline)}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${BRAND.navy};">${escapeHtml(greeting)}</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:${BRAND.navy};">
                Congratulations — your property listing <strong style="color:${BRAND.navy};">${escapeHtml(params.propertyTitle)}</strong> has been reviewed and approved by our team. It is now <strong style="color:${BRAND.gold};">live on adab.ng</strong> and visible to buyers and tenants across Nigeria.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
                Thank you for choosing ${escapeHtml(siteConfig.name)}. We are committed to presenting your property professionally and connecting you with serious enquiries.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${BRAND.cream};border-radius:6px;border-left:4px solid ${BRAND.gold};">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.gray};">Your public listing</p>
                    <p style="margin:0 0 16px;font-size:15px;line-height:1.5;word-break:break-all;">
                      <a href="${listingUrl}" style="color:${BRAND.navy};font-weight:600;text-decoration:underline;">${listingUrl}</a>
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:10px;padding-bottom:10px;">
                          <a href="${listingUrl}" style="display:inline-block;background-color:${BRAND.navy};color:${BRAND.white};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;">View listing</a>
                        </td>
                        <td style="padding-bottom:10px;">
                          <a href="${whatsAppShareUrl}" style="display:inline-block;background-color:#25D366;color:${BRAND.white};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;">Share on WhatsApp</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:${BRAND.gray};">
                      <strong style="color:${BRAND.navy};">Copy link:</strong>
                      <span style="word-break:break-all;"> ${listingUrl}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.navy};">
                Need help with updates, pricing, or enquiries? Reply to this email or reach us anytime — we are here to support you.
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 32px 28px;border-top:1px solid #ece8e0;">
              <p style="margin:24px 0 4px;font-size:15px;line-height:1.6;color:${BRAND.navy};font-weight:600;">Warm regards,</p>
              <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:${BRAND.navy};font-weight:600;">${escapeHtml(siteConfig.name)}</p>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:${BRAND.gray};">${escapeHtml(siteConfig.tagline)}</p>
              <p style="margin:0;font-size:14px;line-height:1.8;color:${BRAND.navy};">
                <a href="mailto:${siteConfig.email}" style="color:${BRAND.gold};text-decoration:none;">${siteConfig.email}</a><br />
                <a href="tel:${siteConfig.phone.replace(/\s/g, "")}" style="color:${BRAND.navy};text-decoration:none;">${siteConfig.phone}</a><br />
                <a href="${siteConfig.website}" style="color:${BRAND.navy};text-decoration:none;">${siteConfig.website.replace(/^https?:\/\//, "")}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.navy};padding:20px 32px;text-align:right;">
              <img src="${cacLogoUrl}" alt="Corporate Affairs Commission Nigeria" width="56" height="56" style="display:block;margin:0 0 8px auto;max-width:56px;height:auto;border:0;" />
              <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.75);letter-spacing:0.03em;">
                CAC Reg. No. ${CAC_REGISTRATION}
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.55);">
                © ${new Date().getFullYear()} ${escapeHtml(siteConfig.name)}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { listingUrl, text, html, subject, displayName };
}

export async function sendListingApprovedEmail(
  params: ListingApprovedEmailParams,
): Promise<SendListingApprovedResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? `Adab Real Estate <${siteConfig.email}>`;

  const { subject, text, html, listingUrl } = buildEmailContent(params);

  if (!apiKey) {
    console.warn(
      "[listing-approved-email] RESEND_API_KEY is not configured — attempting send skipped; approval still succeeded.",
      {
        to: params.to,
        listerName: params.listerName,
        propertyTitle: params.propertyTitle,
        propertySlug: params.propertySlug,
        listingUrl,
        subject,
        from,
        textPreview: text.slice(0, 400),
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
        reply_to: siteConfig.email,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(
        "[listing-approved-email] Resend API error — email not delivered.",
        { status: response.status, body, to: params.to, subject },
      );
      return { sent: false, error: `Resend returned ${response.status}` };
    }

    const result = (await response.json()) as { id?: string };
    console.info("[listing-approved-email] Sent successfully.", {
      to: params.to,
      subject,
      resendId: result.id,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[listing-approved-email] Send failed:", message, {
      to: params.to,
      subject,
    });
    return { sent: false, error: message };
  }
}
