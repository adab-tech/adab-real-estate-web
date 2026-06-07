import { formatLocation } from "@/lib/format";
import type { Property } from "@/types/property";

type PropertyMapProps = {
  property: Property;
};

export function PropertyMap({ property }: PropertyMapProps) {
  const { lat, lng } = property.location;
  const label = encodeURIComponent(
    `${property.title}, ${formatLocation(property.location)}`,
  );
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}(${label})&z=14&output=embed`;

  return (
    <section aria-label="Property location map">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-adab-navy-800">
        Location
      </h2>
      <p className="mt-1 text-sm text-adab-gray-500">
        {formatLocation(property.location)}
        {property.location.address ? ` · ${property.location.address}` : null}
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-adab-gray-300">
        <iframe
          title={`Map — ${property.title}`}
          src={embedUrl}
          className="h-64 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-semibold text-adab-gold-500 hover:text-adab-navy-800"
      >
        Open in Google Maps →
      </a>
    </section>
  );
}
