import { headers } from "next/headers";
import {
  checkRateLimit,
  rateLimitKeyFromHeaders,
} from "@/lib/security/rate-limit";

export async function guardAiRequest(
  suffix: string,
  limit = 12,
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const headerStore = await headers();
  const result = await checkRateLimit(
    rateLimitKeyFromHeaders(headerStore, `ai:${suffix}`),
    limit,
    "1 m",
  );

  if (!result.ok) {
    return {
      ok: false,
      response: Response.json(
        { error: "Too many AI requests. Please try again later." },
        { status: 429 },
      ),
    };
  }

  return { ok: true };
}
