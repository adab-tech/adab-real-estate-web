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
  features: string[] | unknown;
  images: string[] | unknown;
  status: string;
  featured: boolean;
  published_at: string | null;
};

function normalizeFeatures(value: PropertyRow["features"]): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function normalizeImages(value: PropertyRow["images"]): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function normalizeStatus(status: string): Property["status"] {
  if (status === "published") return "available";
  if (status === "unavailable") return "sold";
  if (
    status === "available" ||
    status === "under_offer" ||
    status === "sold" ||
    status === "rented"
  ) {
    return status;
  }
  return "available";
}

function toDbStatus(property: Property): string {
  if (property.dbStatus) return property.dbStatus;
  if (property.status === "available") return "published";
  if (property.status === "sold" || property.status === "rented") {
    return "unavailable";
  }
  return property.status;
}

function normalizePublishedAt(value: string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

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
    features: normalizeFeatures(row.features),
    images: normalizeImages(row.images),
    status: normalizeStatus(row.status),
    dbStatus: row.status,
    featured: row.featured,
    publishedAt: normalizePublishedAt(row.published_at),
  };
}

export function mapPropertyToRow(property: Property): PropertyRow {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    type: property.type,
    category: property.category,
    price_ngn: property.priceNGN,
    price_period: property.pricePeriod ?? null,
    location: property.location,
    beds: property.beds ?? null,
    baths: property.baths ?? null,
    sqm: property.sqm ?? null,
    features: property.features,
    images: property.images,
    status: toDbStatus(property),
    featured: property.featured,
    published_at: property.publishedAt,
  };
}
