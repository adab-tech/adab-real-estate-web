import { properties } from "@/data/properties";
import type { ListingType, Property } from "@/types/property";

export function getAllProperties(): Property[] {
  return [...properties].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeaturedProperties(limit = 3): Property[] {
  return getAllProperties()
    .filter((p) => p.featured && p.status === "available")
    .slice(0, limit);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertiesByType(type?: ListingType | "all"): Property[] {
  const all = getAllProperties();
  if (!type || type === "all") return all;
  return all.filter((p) => p.type === type);
}

export function getAllPropertySlugs(): string[] {
  return properties.map((p) => p.slug);
}
