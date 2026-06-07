import { properties } from "@/data/properties";
import type { ListingType, Property, PropertyFilters } from "@/types/property";

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

export function getPropertyCities(): string[] {
  return [...new Set(properties.map((p) => p.location.city))].sort();
}

export function filterProperties(filters: PropertyFilters): Property[] {
  let result = getAllProperties();

  if (filters.type && filters.type !== "all") {
    result = result.filter((p) => p.type === filters.type);
  }

  if (filters.city && filters.city !== "all") {
    result = result.filter((p) => p.location.city === filters.city);
  }

  if (filters.minPrice && filters.minPrice > 0) {
    result = result.filter((p) => p.priceNGN >= filters.minPrice!);
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    result = result.filter((p) => p.priceNGN <= filters.maxPrice!);
  }

  if (filters.beds && filters.beds > 0) {
    result = result.filter((p) => (p.beds ?? 0) >= filters.beds!);
  }

  return result;
}

/** @deprecated Use filterProperties */
export function getPropertiesByType(type?: ListingType | "all"): Property[] {
  return filterProperties({ type: type ?? "all" });
}

export function getAllPropertySlugs(): string[] {
  return properties.map((p) => p.slug);
}

export function parsePropertySearchParams(
  params: Record<string, string | undefined>,
): PropertyFilters {
  const type =
    params.type === "sale" || params.type === "rent" ? params.type : "all";

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const beds = params.beds ? Number(params.beds) : undefined;

  return {
    type,
    city: params.city || undefined,
    minPrice: minPrice && !Number.isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && !Number.isNaN(maxPrice) ? maxPrice : undefined,
    beds: beds && !Number.isNaN(beds) ? beds : undefined,
  };
}
