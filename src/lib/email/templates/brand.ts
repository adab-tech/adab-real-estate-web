import { siteConfig } from "@/lib/site-config";

export const EMAIL_BRAND = {
  navy: siteConfig.colors.navy,
  gold: siteConfig.colors.gold,
  cream: siteConfig.colors.cream,
  gray: siteConfig.colors.gray,
  white: siteConfig.colors.paper,
} as const;

export const BUSINESS_REGISTRATION = "9590252";

export const EMAIL_LOGO_URL = "https://adab.ng/brand/logo.png";

export function getSiteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.website).replace(
    /\/$/,
    "",
  );
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
