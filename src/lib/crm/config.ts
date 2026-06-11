export type ZohoConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  apiDomain: string;
  accountsDomain: string;
};

function normalizeDomain(
  value: string | undefined,
  fallback: string,
): string {
  const raw = (value?.trim() || fallback).replace(/\/$/, "");
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return raw;
}

export function isZohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN,
  );
}

export function getZohoConfig(): ZohoConfig | null {
  if (!isZohoConfigured()) return null;

  const region = normalizeDomain(process.env.ZOHO_API_DOMAIN, "zoho.com");
  const apiDomain = region.startsWith("http")
    ? region
    : `https://www.zohoapis.${region}`;
  const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN?.trim()
    ? normalizeDomain(process.env.ZOHO_ACCOUNTS_DOMAIN, "accounts.zoho.com")
    : region.startsWith("http")
      ? region.replace("www.zohoapis.", "accounts.")
      : `https://accounts.${region}`;

  return {
    clientId: process.env.ZOHO_CLIENT_ID!,
    clientSecret: process.env.ZOHO_CLIENT_SECRET!,
    refreshToken: process.env.ZOHO_REFRESH_TOKEN!,
    apiDomain,
    accountsDomain,
  };
}
