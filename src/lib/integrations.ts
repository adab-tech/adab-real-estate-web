import { checkZohoHealth, isZohoConfigured } from "@/lib/crm";

export type IntegrationStatus = {
  id: string;
  name: string;
  configured: boolean;
  connected?: boolean;
  connectionError?: string;
  envVars: string[];
  docs?: string;
};

export async function getIntegrationStatuses(): Promise<IntegrationStatus[]> {
  const zohoConfigured = isZohoConfigured();
  const zohoHealth = zohoConfigured ? await checkZohoHealth() : null;

  return [
    {
      id: "supabase",
      name: "Supabase",
      configured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      docs: "https://supabase.com/dashboard",
    },
    {
      id: "resend",
      name: "Resend (email)",
      configured: Boolean(process.env.RESEND_API_KEY),
      envVars: ["RESEND_API_KEY", "EMAIL_FROM"],
      docs: "https://resend.com/api-keys",
    },
    {
      id: "paystack",
      name: "Paystack (Nigeria payments)",
      configured: Boolean(
        process.env.PAYSTACK_SECRET_KEY &&
          (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
            process.env.PAYSTACK_PUBLIC_KEY),
      ),
      envVars: [
        "PAYSTACK_SECRET_KEY",
        "PAYSTACK_PUBLIC_KEY",
        "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
      ],
      docs: "https://dashboard.paystack.com/#/settings/developers",
    },
    {
      id: "flutterwave",
      name: "Flutterwave (alternative payments)",
      configured: Boolean(
        process.env.FLUTTERWAVE_SECRET_KEY &&
          (process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ||
            process.env.FLUTTERWAVE_PUBLIC_KEY),
      ),
      envVars: [
        "FLUTTERWAVE_SECRET_KEY",
        "FLUTTERWAVE_PUBLIC_KEY",
        "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY",
        "FLUTTERWAVE_WEBHOOK_SECRET",
      ],
      docs: "https://dashboard.flutterwave.com/settings/developers",
    },
    {
      id: "zoho",
      name: "Zoho CRM",
      configured: zohoConfigured,
      connected: zohoHealth?.connected,
      connectionError: zohoHealth?.connected
        ? undefined
        : zohoHealth?.message,
      envVars: [
        "ZOHO_CLIENT_ID",
        "ZOHO_CLIENT_SECRET",
        "ZOHO_REFRESH_TOKEN",
        "ZOHO_API_DOMAIN",
      ],
      docs: "https://api-console.zoho.com/",
    },
  ];
}
