import type { ListingType, Property } from "@/types/property";

export function formatNgn(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}K`;
  }
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatPropertyPrice(
  priceNGN: number,
  type: ListingType,
  pricePeriod?: Property["pricePeriod"],
): string {
  if (pricePeriod === "negotiable") return "Negotiable";
  const base = formatNgn(priceNGN);
  if (type === "rent") {
    if (pricePeriod === "month") return `${base}/mo`;
    if (pricePeriod === "year") return `${base}/yr`;
    return base;
  }
  return base;
}

export function formatLocation(location: Property["location"]): string {
  return `${location.area}, ${location.city}`;
}

export function categoryLabel(category: Property["category"]): string {
  const labels: Record<Property["category"], string> = {
    apartment: "Apartment",
    house: "House",
    duplex: "Duplex",
    land: "Land",
    commercial: "Commercial",
  };
  return labels[category];
}
