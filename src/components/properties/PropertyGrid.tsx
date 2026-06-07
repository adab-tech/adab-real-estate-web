import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Property } from "@/types/property";

type PropertyGridProps = {
  properties: Property[];
};

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <p className="py-16 text-center text-adab-gray-500">
        No properties match this filter. Try another category or check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
