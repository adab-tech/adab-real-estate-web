import { generateText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePortalApi } from "@/lib/ai/api-auth";
import { requireGoogleModel } from "@/lib/ai/config";
import { assertAiConfigured, handleAiError } from "@/lib/ai/errors";
import { guardAiRequest } from "@/lib/ai/rate-limit";

const bodySchema = z.object({
  title: z.string().min(3).max(200),
  type: z.enum(["sale", "rent"]),
  category: z.string().min(2).max(50),
  priceNgn: z.number().int().nonnegative(),
  pricePeriod: z.enum(["year", "month"]).optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  beds: z.number().int().nonnegative().optional(),
  baths: z.number().int().nonnegative().optional(),
  sqm: z.number().nonnegative().optional(),
  features: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const auth = await requirePortalApi();
  if ("error" in auth) return auth.error;

  const rateLimit = await guardAiRequest("listing-description", 8);
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

  const data = parsed.data;

  try {
    assertAiConfigured();
    const model = requireGoogleModel();

    const location = [data.area, data.city, data.state].filter(Boolean).join(", ");
    const priceLabel =
      data.type === "rent"
        ? `₦${data.priceNgn.toLocaleString("en-NG")}${data.pricePeriod === "month" ? "/month" : "/year"}`
        : `₦${data.priceNgn.toLocaleString("en-NG")}`;

    const { text } = await generateText({
      model,
      prompt: `Write a professional property listing description for Adab Real Estate Agency in Nigeria.

Title: ${data.title}
Type: ${data.type === "rent" ? "For rent" : "For sale"}
Category: ${data.category}
Price: ${priceLabel}
Location: ${location || "Nigeria"}
Bedrooms: ${data.beds ?? "N/A"}
Bathrooms: ${data.baths ?? "N/A"}
Size (sqm): ${data.sqm ?? "N/A"}
Features: ${data.features?.join(", ") || "None listed"}

Requirements:
- 2–4 short paragraphs, warm and trustworthy tone
- Highlight location and lifestyle benefits for Nigerian buyers/renters
- Mention Adab's verified listing quality subtly (one sentence max)
- No bullet lists, no markdown, no emojis
- Do not invent amenities not listed above`,
    });

    return NextResponse.json({ description: text.trim() });
  } catch (error) {
    return handleAiError(error);
  }
}
