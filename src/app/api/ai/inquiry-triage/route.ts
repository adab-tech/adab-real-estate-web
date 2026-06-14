import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/ai/api-auth";
import { requireGoogleModel } from "@/lib/ai/config";
import { assertAiConfigured, handleAiError } from "@/lib/ai/errors";
import { guardAiRequest } from "@/lib/ai/rate-limit";
import { inquiryTriageSchema } from "@/lib/ai/schemas";

const bodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().nullable().optional(),
  message: z.string(),
  source: z.string().optional(),
  propertySlug: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rateLimit = await guardAiRequest("inquiry-triage", 20);
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

    const { object } = await generateObject({
      model,
      schema: inquiryTriageSchema,
      prompt: `You are a customer service assistant for Adab Real Estate Agency in Nigeria. Triage this website inquiry and draft a helpful reply.

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email ?? "Not provided"}
Source: ${data.source ?? "contact"}
Property: ${data.propertySlug ?? "General inquiry"}
Message: ${data.message}

Provide:
- priority: low/medium/high/urgent based on buying/renting intent and urgency
- category: viewing, pricing, general, rental, purchase, complaint, or other
- summary: one sentence for admin dashboard
- suggestedAction: what Adab staff should do next
- draftReply: friendly WhatsApp-style reply (2–4 sentences, sign off as "Adab Real Estate Team", mention +234 812 827 2287 if callback needed)`,
    });

    return NextResponse.json(object);
  } catch (error) {
    return handleAiError(error);
  }
}
