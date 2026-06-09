import { cache } from "react";
import { properties as staticProperties } from "@/data/properties";
import { locationMatches } from "@/lib/nigeria-locations";
import {
  fetchPropertiesFromSupabase,
  fetchPropertyBySlugFromSupabase,
} from "@/lib/supabase/properties";
import { isSupabaseConfigured } from "@/lib/supabase/server";
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
  if (isSupabaseConfigured()) {
    const fromDb = await fetchPropertiesFromSupabase();
    if (fromDb !== null) return sortProperties(fromDb);
    return [];
  }
  return getStaticProperties();
});

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const all = await getAllProperties();
  const available = all.filter((p) => p.status === "available");
  const featured = available.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const recent = available.filter((p) => !featuredSlugs.has(p.slug));
  return [...featured, ...recent].slice(0, limit);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  if (isSupabaseConfigured()) {
    const fromDb = await fetchPropertyBySlugFromSupabase(slug);
    return fromDb ?? undefined;
  }
  return staticProperties.find((p) => p.slug === slug);
}

export async function getPropertyCities(state?: string): Promise<string[]> {
  const all = await getAllProperties();
  const fromListings = [
    ...new Set(
      all
        .filter((p) =>
          state && state !== "all"
            ? locationMatches(p.location, { state })
            : true,
        )
        .map((p) => p.location.city)
        .filter(Boolean),
    ),
  ];
  return fromListings.sort((a, b) => a.localeCompare(b));
}

export async function filterProperties(
  filters: PropertyFilters,
): Promise<Property[]> {
  let result = await getAllProperties();

  if (filters.type && filters.type !== "all") {
    result = result.filter((p) => p.type === filters.type);
  }

  if (filters.state && filters.state !== "all") {
    result = result.filter((p) =>
      locationMatches(p.location, { state: filters.state }),
    );
  }

  if (filters.city && filters.city !== "all") {
    result = result.filter((p) =>
      locationMatches(p.location, { city: filters.city }),
    );
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
    state: params.state || undefined,
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
