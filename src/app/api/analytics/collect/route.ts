import { NextResponse } from "next/server";
import { extractGeoFromHeaders } from "@/lib/analytics/geo";
import { normalizeReferrerSource } from "@/lib/analytics/referrer";
import { parseUserAgent } from "@/lib/analytics/user-agent";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CollectBody = {
  path?: string;
  referrer?: string;
  visitorId?: string;
};

const SKIP_PREFIXES = ["/admin", "/portal", "/tenant", "/api/"];

function shouldSkipPath(path: string): boolean {
  return SKIP_PREFIXES.some((p) => path.startsWith(p));
}

export async function POST(request: Request) {
  let body: CollectBody = {};
  try {
    body = (await request.json()) as CollectBody;
  } catch {
    return new Response(null, { status: 400 });
  }

  const path = body.path?.trim() || "/";
  if (shouldSkipPath(path)) {
    return new Response(null, { status: 204 });
  }

  const referrer = body.referrer?.trim() || null;
  const geo = extractGeoFromHeaders(request.headers);
  const userAgent = request.headers.get("user-agent");
  const { deviceType, browser } = parseUserAgent(userAgent);

  const supabase = getSupabaseServerClient();
  if (supabase) {
    void supabase
      .from("page_views")
      .insert({
        path: path.slice(0, 500),
        referrer: referrer?.slice(0, 500) ?? null,
        referrer_source: normalizeReferrerSource(referrer),
        country: geo.country,
        region: geo.region,
        city: geo.city,
        device_type: deviceType,
        browser,
        visitor_id: body.visitorId?.slice(0, 64) ?? null,
      })
      .then(({ error }) => {
        if (error) console.error("[analytics] insert failed:", error.message);
      });
  }

  return new Response(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
