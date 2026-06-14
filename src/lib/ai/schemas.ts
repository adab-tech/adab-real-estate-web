import { z } from "zod";

export const propertyFiltersSchema = z.object({
  type: z.enum(["sale", "rent", "all"]).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().nonnegative().optional(),
  beds: z.number().int().nonnegative().optional(),
});

export const inquiryTriageSchema = z.object({
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum([
    "viewing",
    "pricing",
    "general",
    "rental",
    "purchase",
    "complaint",
    "other",
  ]),
  summary: z.string(),
  suggestedAction: z.string(),
  draftReply: z.string(),
});

export const applicationSummarySchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendedStatus: z.enum([
    "submitted",
    "reviewing",
    "approved",
    "rejected",
    "withdrawn",
  ]),
  reviewNotes: z.string(),
});

export type PropertyFiltersAi = z.infer<typeof propertyFiltersSchema>;
export type InquiryTriageResult = z.infer<typeof inquiryTriageSchema>;
export type ApplicationSummaryResult = z.infer<typeof applicationSummarySchema>;
