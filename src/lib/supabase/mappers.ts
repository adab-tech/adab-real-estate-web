import type { Property, PropertyLocation } from "@/types/property";

export type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: Property["type"];
  category: Property["category"];
  price_ngn: number;
  price_period: Property["pricePeriod"] | null;
  location: PropertyLocation;
  beds: number | null;
  baths: number | null;
  sqm: number | null;
  features: string[];
  images: string[];
  status: Property["status"];
  featured: boolean;
  published_at: string;
};

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    priceNGN: Number(row.price_ngn),
    pricePeriod: row.price_period ?? undefined,
    location: row.location,
    beds: row.beds ?? undefined,
    baths: row.baths ?? undefined,
    sqm: row.sqm ?? undefined,
    features: row.features ?? [],
    images: row.images ?? [],
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
  };
}
