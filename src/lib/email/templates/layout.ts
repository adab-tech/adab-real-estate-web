import { siteConfig } from "@/lib/site-config";
import {
  BUSINESS_REGISTRATION,
  EMAIL_BRAND,
  EMAIL_LOGO_URL,
  escapeHtml,
} from "@/lib/email/templates/brand";

export type EmailCta = {
  label: string;
  url: string;
};

export type AdabEmailLayoutInput = {
  title: string;
  preheader?: string;
  greeting?: string;
  bodyHtml: string;
  cta?: EmailCta;
  secondaryCta?: EmailCta;
  closingHtml?: string;
};

export function buildAdabEmailHtml(input: AdabEmailLayoutInput): string {
  const { navy, gold, cream, gray, white } = EMAIL_BRAND;
  const preheader = input.preheader ?? input.title;
  const greeting = input.greeting
    ? `<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${navy};">${input.greeting}</p>`
    : "";

  const primaryCta = input.cta
    ? `<a href="${input.cta.url}" style="display:inline-block;background-color:${gold};color:${navy};font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.02em;">${escapeHtml(input.cta.label)}</a>`
    : "";

  const secondaryCta = input.secondaryCta
    ? `<a href="${input.secondaryCta.url}" style="display:inline-block;background-color:${navy};color:${white};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;margin-left:10px;">${escapeHtml(input.secondaryCta.label)}</a>`
    : "";

  const ctaBlock =
    input.cta || input.secondaryCta
      ? `<tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="padding-bottom:10px;">${primaryCta}${secondaryCta}</td>
                </tr>
              </table>
            </td>
          </tr>`
      : "";

  const closing = input.closingHtml
    ? `<tr>
            <td style="padding:0 32px 28px;">
              ${input.closingHtml}
            </td>
          </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${cream};font-family:Georgia,'Times New Roman',Times,serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:${white};border:1px solid #e8e4dc;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:${navy};padding:28px 32px;text-align:center;">
              <img src="${EMAIL_LOGO_URL}" alt="${escapeHtml(siteConfig.name)}" width="180" height="48" style="display:block;margin:0 auto 12px;max-width:180px;height:auto;border:0;" />
              <p style="margin:0;font-size:13px;line-height:1.5;color:${gold};letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(siteConfig.tagline)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              ${greeting}
              ${input.bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          ${closing}
          <tr>
            <td style="padding:0 32px 28px;border-top:1px solid #ece8e0;">
              <p style="margin:24px 0 4px;font-size:15px;line-height:1.6;color:${navy};font-weight:600;">Warm regards,</p>
              <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:${navy};font-weight:600;">${escapeHtml(siteConfig.name)}</p>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:${gray};">${escapeHtml(siteConfig.tagline)}</p>
              <p style="margin:0;font-size:14px;line-height:1.8;color:${navy};">
                <a href="mailto:${siteConfig.email}" style="color:${gold};text-decoration:none;">${siteConfig.email}</a><br />
                <a href="tel:${siteConfig.phone.replace(/\s/g, "")}" style="color:${navy};text-decoration:none;">${siteConfig.phone}</a><br />
                <a href="${siteConfig.website}" style="color:${navy};text-decoration:none;">${siteConfig.website.replace(/^https?:\/\//, "")}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${navy};padding:20px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.85);letter-spacing:0.03em;">
                Business Name Reg. No. ${BUSINESS_REGISTRATION}
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
}

export function buildBodyParagraph(
  text: string,
  options?: { muted?: boolean; strong?: boolean },
): string {
  const color = options?.muted ? EMAIL_BRAND.gray : EMAIL_BRAND.navy;
  const weight = options?.strong ? "font-weight:600;" : "";
  return `<p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:${color};${weight}">${text}</p>`;
}
