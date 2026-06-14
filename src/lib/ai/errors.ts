import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/ai/config";

export function aiNotConfiguredResponse() {
  return NextResponse.json(
    { error: "AI is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY." },
    { status: 503 },
  );
}

export function assertAiConfigured() {
  if (!isAiConfigured()) {
    throw new Error("AI_NOT_CONFIGURED");
  }
}

export function handleAiError(error: unknown) {
  if (error instanceof Error && error.message === "AI_NOT_CONFIGURED") {
    return aiNotConfiguredResponse();
  }
  console.error("[ai]", error);
  return NextResponse.json(
    { error: "AI request failed. Please try again." },
    { status: 500 },
  );
}
