import { siteConfig } from "@/lib/site-config";

export type SendResendResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  logTag: string;
}): Promise<SendResendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? `Adab Real Estate <${siteConfig.email}>`;

  if (!apiKey) {
    console.warn(`[${input.logTag}] RESEND_API_KEY not configured — email skipped.`, {
      to: input.to,
      subject: input.subject,
      textPreview: input.text.slice(0, 300),
    });
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
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
        reply_to: siteConfig.email,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[${input.logTag}] Resend API error.`, {
        status: response.status,
        body,
        to: input.to,
      });
      return { sent: false, error: `Resend returned ${response.status}` };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error(`[${input.logTag}] Send failed:`, message);
    return { sent: false, error: message };
  }
}
