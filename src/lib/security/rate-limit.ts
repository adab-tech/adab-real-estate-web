import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  ok: boolean;
  remaining?: number;
  skipped?: boolean;
};

function getRatelimit(limit: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: "adab:rl",
  });
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  window: `${number} ${"s" | "m" | "h" | "d"}` = "1 m",
): Promise<RateLimitResult> {
  const ratelimit = getRatelimit(limit, window);
  if (!ratelimit) {
    return { ok: true, skipped: true };
  }

  const result = await ratelimit.limit(key);
  return { ok: result.success, remaining: result.remaining };
}

export function rateLimitKeyFromHeaders(
  headers: Headers,
  suffix: string,
): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${suffix}:${ip}`;
}
