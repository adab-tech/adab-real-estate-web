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

export type PropertyFilters = {
  type?: ListingType | "all";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ListingType;
  category: PropertyCategory;
  priceNGN: number;
  pricePeriod?: "year" | "month";
  location: PropertyLocation;
  beds?: number;
  baths?: number;
  sqm?: number;
  features: string[];
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  publishedAt: string;
};
