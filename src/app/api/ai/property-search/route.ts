import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireGoogleModel } from "@/lib/ai/config";
import { assertAiConfigured, handleAiError } from "@/lib/ai/errors";
import { guardAiRequest } from "@/lib/ai/rate-limit";
import { propertyFiltersSchema } from "@/lib/ai/schemas";
import { NIGERIA_STATES } from "@/lib/nigeria-locations";

const bodySchema = z.object({
  query: z.string().min(3).max(500),
});

export async function POST(request: Request) {
  const rateLimit = await guardAiRequest("property-search", 15);
  if (!rateLimit.ok) return rateLimit.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  try {
    assertAiConfigured();
    const model = requireGoogleModel();

    const { object } = await generateObject({
      model,
      schema: propertyFiltersSchema,
      prompt: `Convert this natural-language property search into structured filters for a Nigerian real estate website.

User query: "${parsed.data.query}"

Rules:
- type: "sale", "rent", or "all" if unclear
- state: must match one of these Nigerian states exactly, or omit: ${NIGERIA_STATES.join(", ")}
- city: city/LGA name if mentioned, else omit
- minPrice/maxPrice: NGN integers (e.g. "50 million" → 50000000). Lagos luxury often 80M–500M+; Abuja mid-range 30M–150M
- beds: minimum bedrooms if mentioned
- Omit fields you cannot infer confidently`,
    });

    return NextResponse.json({ filters: object });
  } catch (error) {
    return handleAiError(error);
  }
}
