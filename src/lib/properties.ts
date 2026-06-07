import { cache } from "react";
import { properties as staticProperties } from "@/data/properties";
import {
  fetchPropertiesFromSupabase,
  fetchPropertyBySlugFromSupabase,
} from "@/lib/supabase/properties";
import type { ListingType, Property, PropertyFilters } from "@/types/property";

function sortProperties(list: Property[]): Property[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function getStaticProperties(): Property[] {
  return sortProperties(staticProperties);
}

export const getAllProperties = cache(async (): Promise<Property[]> => {
  const fromDb = await fetchPropertiesFromSupabase();
  if (fromDb?.length) return fromDb;
  return getStaticProperties();
});

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const all = await getAllProperties();
  return all
    .filter((p) => p.featured && p.status === "available")
    .slice(0, limit);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  const fromDb = await fetchPropertyBySlugFromSupabase(slug);
  if (fromDb) return fromDb;
  return staticProperties.find((p) => p.slug === slug);
}

export async function getPropertyCities(): Promise<string[]> {
  const all = await getAllProperties();
  return [...new Set(all.map((p) => p.location.city))].sort();
}

export async function filterProperties(
  filters: PropertyFilters,
): Promise<Property[]> {
  let result = await getAllProperties();

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

export async function getAllPropertySlugs(): Promise<string[]> {
  const all = await getAllProperties();
  return all.map((p) => p.slug);
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

/** @deprecated Use filterProperties */
export async function getPropertiesByType(
  type?: ListingType | "all",
): Promise<Property[]> {
  return filterProperties({ type: type ?? "all" });
}
