import { z } from "zod";

export const propertyFormSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  title: z.string().min(3),
  description: z.string().min(20),
  type: z.enum(["sale", "rent"]),
  category: z.enum(["apartment", "house", "duplex", "land", "commercial"]),
  priceNGN: z.coerce.number().positive(),
  pricePeriod: z
    .enum(["year", "month", "negotiable"])
    .optional()
    .or(z.literal("")),
  city: z.string().min(2),
  area: z.string().min(2),
  state: z.string().min(2),
  address: z.string().optional(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  beds: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? "" : v)),
  baths: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? "" : v)),
  sqm: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? "" : v)),
  features: z.string().optional(),
  images: z.string().min(1),
  status: z.enum(["available", "under_offer", "sold", "rented"]),
  featured: z.boolean(),
  publishedAt: z.string().min(1),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseFeatures(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatFeatures(features: string[]): string {
  return features.join("\n");
}

export function formatImages(images: string[]): string {
  return images.join("\n");
}
