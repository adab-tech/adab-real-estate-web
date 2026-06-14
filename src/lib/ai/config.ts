import { google } from "@ai-sdk/google";

export function isAiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export function getGoogleModel(modelId = "gemini-2.0-flash") {
  if (!isAiConfigured()) {
    return null;
  }
  return google(modelId);
}

export function requireGoogleModel(modelId = "gemini-2.0-flash") {
  const model = getGoogleModel(modelId);
  if (!model) {
    throw new Error("AI is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY.");
  }
  return model;
}
