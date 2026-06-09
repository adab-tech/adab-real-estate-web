import Image from "next/image";
import Link from "next/link";
import {
  categoryLabel,
  formatLocation,
  formatPropertyPrice,
} from "@/lib/format";
import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
};

function statusLabel(status: Property["status"]): string {
  const labels: Record<Property["status"], string> = {
    available: "Available",
    under_offer: "Under offer",
    sold: "Sold",
    rented: "Rented",
  };
  return labels[status];
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export function PropertyCard({ property }: PropertyCardProps) {
  const isUnavailable = property.status === "sold" || property.status === "rented";
  const imageSrc = property.images[0] || PLACEHOLDER_IMAGE;

  return (
    <article className="group overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(27,42,74,0.14)]">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-adab-cream">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-adab-navy-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {property.type === "sale" ? "For sale" : "For rent"}
            </span>
            {property.featured ? (
              <span className="rounded-full bg-adab-gold-500 px-3 py-1 text-xs font-semibold text-adab-navy-900">
                Featured
              </span>
            ) : null}
          </div>
          {isUnavailable ? (
            <div className="absolute inset-0 flex items-center justify-center bg-adab-navy-900/50">
              <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-adab-navy-800">
                {statusLabel(property.status)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="p-5">
          <p className="text-lg font-bold text-adab-gold-500">
            {formatPropertyPrice(
              property.priceNGN,
              property.type,
              property.pricePeriod,
            )}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-adab-navy-800 group-hover:text-adab-gold-500">
            {property.title}
          </h3>
          <p className="mt-2 text-sm text-adab-gray-500">
            {formatLocation(property.location)} · {categoryLabel(property.category)}
          </p>
          {(property.beds || property.baths || property.sqm) && (
            <ul className="mt-3 flex flex-wrap gap-3 text-xs text-adab-navy-700">
              {property.beds ? <li>{property.beds} beds</li> : null}
              {property.baths ? <li>{property.baths} baths</li> : null}
              {property.sqm ? <li>{property.sqm} sqm</li> : null}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
