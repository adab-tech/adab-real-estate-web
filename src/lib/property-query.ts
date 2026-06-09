import type { PropertyFilters } from "@/types/property";

export function buildQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.state && filters.state !== "all") params.set("state", filters.state);
  if (filters.city && filters.city !== "all") params.set("city", filters.city);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.beds) params.set("beds", String(filters.beds));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
