import { getZohoConfig, isZohoConfigured } from "@/lib/crm/config";

type ZohoTokenResponse = {
  access_token?: string;
  error?: string;
};

type ZohoRecordResponse = {
  data?: Array<{ code?: string; details?: { id?: string }; message?: string }>;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const config = getZohoConfig();
  if (!config) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${config.accountsDomain}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[zoho] token refresh failed:", await res.text());
    return null;
  }

  const json = (await res.json()) as ZohoTokenResponse;
  if (!json.access_token) {
    console.error("[zoho] token refresh missing access_token:", json.error);
    return null;
  }

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + 50 * 60 * 1000,
  };

  return json.access_token;
}

async function createZohoRecords(
  module: "Leads" | "Deals",
  records: Record<string, string>[],
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const config = getZohoConfig();
  if (!config) return { ok: false, error: "Zoho not configured" };

  const token = await getAccessToken();
  if (!token) return { ok: false, error: "Zoho token unavailable" };

  const res = await fetch(`${config.apiDomain}/crm/v2/${module}`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: records }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[zoho] ${module} create failed:`, text);
    return { ok: false, error: text };
  }

  const json = (await res.json()) as ZohoRecordResponse;
  const first = json.data?.[0];
  if (first?.code !== "SUCCESS") {
    return { ok: false, error: first?.message ?? "Zoho create failed" };
  }

  return { ok: true, id: first.details?.id };
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: "", last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function checkZohoHealth(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!isZohoConfigured()) {
    return { connected: false, message: "Missing Zoho env vars" };
  }

  const token = await getAccessToken();
  if (!token) {
    return { connected: false, message: "OAuth refresh failed" };
  }

  return { connected: true, message: "OAuth token refreshed" };
}

export async function createZohoLead(input: {
  fullName: string;
  email?: string;
  phone?: string;
  source: string;
  description: string;
  propertyInterest?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { first, last } = splitName(input.fullName || "Website Lead");

  const record: Record<string, string> = {
    Last_Name: last || input.fullName || "Lead",
    Lead_Source: input.source,
    Description: input.description,
  };

  if (first) record.First_Name = first;
  if (input.email) record.Email = input.email;
  if (input.phone) record.Phone = input.phone;
  if (input.propertyInterest) {
    record.Company = `Property: ${input.propertyInterest}`;
  }

  return createZohoRecords("Leads", [record]);
}

export async function createZohoDeal(input: {
  dealName: string;
  amountNgn?: number;
  description: string;
  contactEmail?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const record: Record<string, string> = {
    Deal_Name: input.dealName,
    Description: input.description,
    Stage: "Qualification",
  };

  if (input.amountNgn && input.amountNgn > 0) {
    record.Amount = String(input.amountNgn);
  }

  return createZohoRecords("Deals", [record]);
}
