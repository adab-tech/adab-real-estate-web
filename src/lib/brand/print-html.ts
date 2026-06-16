import type { BrandTemplateData, BrandTemplateType } from "@/lib/brand/types";
import { BRAND_COLORS } from "@/lib/brand/templates";

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif; background: #e8e6e1; color: ${BRAND_COLORS.navy}; }
  .toolbar { position: sticky; top: 0; z-index: 10; background: ${BRAND_COLORS.navy}; color: #fff; padding: 0.75rem 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; font-size: 0.875rem; }
  .toolbar button { background: ${BRAND_COLORS.gold}; color: ${BRAND_COLORS.navy}; border: none; border-radius: 999px; padding: 0.5rem 1.25rem; font-weight: 600; cursor: pointer; }
  @media print { body { background: #fff; } .toolbar { display: none; } }
`;

function socialPostHtml(
  data: BrandTemplateData,
  width: number,
  height: number,
  vertical: boolean,
): string {
  const footerPad = vertical ? "48px 56px 64px" : "40px 56px 56px";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>Adab Brand Export</title><style>
${baseStyles}
.canvas-wrap { display: flex; justify-content: center; padding: 1.5rem; }
.post { width: ${width}px; height: ${height}px; background: ${BRAND_COLORS.navy}; display: grid; grid-template-rows: auto 1fr auto; overflow: hidden; }
.post-header { padding: 48px 56px 32px; display: flex; justify-content: space-between; align-items: center; }
.post-header img { height: 56px; filter: brightness(0) invert(1); }
.badge { background: ${BRAND_COLORS.gold}; color: ${BRAND_COLORS.navy}; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 28px; border-radius: 999px; }
.hero { position: relative; margin: 0 56px; border-radius: 16px; overflow: hidden; background: ${BRAND_COLORS.cream}; min-height: 0; }
.hero img { width: 100%; height: 100%; object-fit: cover; }
.post-footer { padding: ${footerPad}; background: linear-gradient(transparent, rgba(15,26,46,0.85)); margin-top: -120px; position: relative; z-index: 1; }
.price { font-size: 52px; font-weight: 800; color: ${BRAND_COLORS.gold}; margin-bottom: 8px; }
.title { font-size: 38px; font-weight: 700; color: ${BRAND_COLORS.cream}; line-height: 1.2; margin-bottom: 12px; }
.subtitle { font-size: 26px; color: rgba(248,246,241,0.85); }
.cta { margin-top: 28px; display: inline-block; background: ${BRAND_COLORS.gold}; color: ${BRAND_COLORS.navy}; font-size: 24px; font-weight: 700; padding: 16px 36px; border-radius: 999px; text-decoration: none; }
.cac { text-align: center; font-size: 18px; color: rgba(248,246,241,0.5); padding: 0 56px 32px; }
@media print { .canvas-wrap { padding: 0; } .post { box-shadow: none; } }
</style></head><body>
<div class="toolbar"><span>Adab brand export · Print or Save as PDF</span><button type="button" onclick="window.print()">Print / Save PDF</button></div>
<div class="canvas-wrap"><article class="post">
<header class="post-header"><img src="/brand/logo.png" alt="Adab"/><span class="badge">${esc(data.badge)}</span></header>
<div class="hero"><img src="${esc(data.photoUrl)}" alt="Property"/></div>
<footer class="post-footer">
<p class="price">${esc(data.price)}</p>
<h1 class="title">${esc(data.title)}</h1>
<p class="subtitle">${esc(data.subtitle || data.location)}</p>
<a class="cta" href="${esc(data.ctaLink)}">${esc(data.ctaLabel)}</a>
</footer>
<p class="cac">Adab Real Estate Agency · CAC RC 9590252</p>
</article></div></body></html>`;
}

export function generatePrintableHtml(
  templateType: BrandTemplateType,
  data: BrandTemplateData,
): string {
  switch (templateType) {
    case "instagram-post":
    case "property-promo":
      return socialPostHtml(data, 1080, 1080, false);
    case "instagram-story":
    case "whatsapp-status":
      return socialPostHtml(data, 1080, 1920, true);
    case "linkedin-post":
      return socialPostHtml(data, 1200, 627, false);
    case "linkedin-cover":
      return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>LinkedIn Cover</title><style>
${baseStyles}
.cover { width: 1584px; height: 396px; margin: 1.5rem auto; background: linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.navyDark} 100%); display: flex; align-items: center; justify-content: space-between; padding: 0 80px; color: ${BRAND_COLORS.cream}; }
.cover img.logo { height: 72px; filter: brightness(0) invert(1); }
.cover h1 { font-size: 48px; font-weight: 800; max-width: 900px; }
.cover p { font-size: 24px; color: ${BRAND_COLORS.gold}; margin-top: 12px; }
</style></head><body>
<div class="toolbar"><span>LinkedIn cover · 1584×396</span><button onclick="window.print()">Print</button></div>
<div class="cover"><div><h1>${esc(data.title)}</h1><p>${esc(data.subtitle)}</p></div><img class="logo" src="/brand/logo.png" alt="Adab"/></div>
</body></html>`;
    case "business-card":
    case "email-signature":
    case "letterhead":
    case "flyer-a5":
    case "property-flyer":
    default: {
      const staticMap: Partial<Record<BrandTemplateType, string>> = {
        "business-card": "/brand/downloads/office/business-card.html",
        "email-signature": "/brand/downloads/office/email-signature.html",
        letterhead: "/brand/downloads/office/letterhead.html",
        "property-flyer": "/brand/downloads/office/property-flyer.html",
      };
      const staticPath = staticMap[templateType];
      if (staticPath) {
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta http-equiv="refresh" content="0;url=${staticPath}"/></head><body><p>Opening <a href="${staticPath}">static template</a>…</p></body></html>`;
      }
      return socialPostHtml(data, 559, 794, true);
    }
  }
}

export function openPrintableHtml(
  templateType: BrandTemplateType,
  data: BrandTemplateData,
): void {
  const html = generatePrintableHtml(templateType, data);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}
