import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/ai/api-auth";
import { requireGoogleModel } from "@/lib/ai/config";
import { assertAiConfigured, handleAiError } from "@/lib/ai/errors";
import { guardAiRequest } from "@/lib/ai/rate-limit";
import { applicationSummarySchema } from "@/lib/ai/schemas";

const bodySchema = z.object({
  applicationType: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  propertyInterest: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: z.string().optional(),
});

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rateLimit = await guardAiRequest("application-summary", 20);
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
      schema: applicationSummarySchema,
      prompt: `You are an admin assistant for Adab Real Estate Agency (Nigeria). Review this property management / rental application and produce a concise internal summary.

Application type: ${data.applicationType}
Applicant: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Property interest: ${data.propertyInterest ?? "Not specified"}
Current status: ${data.status ?? "submitted"}
Additional details: ${data.message ?? "None"}

Provide:
- summary: 2–3 sentences for the admin team
- strengths: applicant positives (max 4)
- concerns: red flags or missing info (max 4, empty if none)
- recommendedStatus: one of submitted, reviewing, approved, rejected, withdrawn
- reviewNotes: suggested admin note to save (1–2 sentences, professional)`,
    });

    return NextResponse.json(object);
  } catch (error) {
    return handleAiError(error);
  }
}
