export type ListingType = "sale" | "rent";

export type PropertyCategory =
  | "apartment"
  | "house"
  | "duplex"
  | "land"
  | "commercial";

export type PropertyStatus =
  | "available"
  | "under_offer"
  | "sold"
  | "rented";

export type PropertyLocation = {
  city: string;
  area: string;
  state: string;
  address?: string;
  lat: number;
  lng: number;
};

export type PricePeriod = "year" | "month" | "negotiable";

export type PropertyFilters = {
  type?: ListingType | "all";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
};

export type PropertyDbStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "unavailable"
  | "rejected";

export type PropertyMarketStatus =
  | "available"
  | "under_offer"
  | "sold"
  | "rented";

export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ListingType;
  category: PropertyCategory;
  priceNGN: number;
  pricePeriod?: PricePeriod;
  location: PropertyLocation;
  beds?: number;
  baths?: number;
  sqm?: number;
  features: string[];
  images: string[];
  status: PropertyStatus;
  /** Raw Supabase status for admin edits (portal listings). */
  dbStatus?: PropertyDbStatus | string;
  featured: boolean;
  publishedAt: string;
};
