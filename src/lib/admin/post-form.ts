import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120)
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(500).optional().default(""),
  bodyHtml: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  gallery: z.string().optional().default(""),
  postType: z.enum(["blog", "promo", "announcement", "release"]),
  status: z.enum(["draft", "published", "scheduled"]),
  publishedAt: z.string().optional().default(""),
  scheduledAt: z.string().optional().default(""),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export function parseTags(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i);
}

export function tagsToString(tags: string[]): string {
  return tags.join(", ");
}

export function parseGallery(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
}

export function galleryToString(gallery: string[]): string {
  return gallery.join("\n");
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}
