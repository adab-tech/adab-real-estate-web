import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyFilter } from "@/components/properties/PropertyFilter";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { getPropertiesByType } from "@/lib/properties";
import type { ListingType } from "@/types/property";

export const metadata = { title: "Properties" };

type PropertiesPageProps = {
  searchParams: Promise<{ type?: string }>;
};

function parseType(value?: string): ListingType | "all" {
  if (value === "sale" || value === "rent") return value;
  return "all";
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const { type: typeParam } = await searchParams;
  const type = parseType(typeParam);
  const listings = getPropertiesByType(type);

  return (
    <main>
      <PageHeader
        title="Properties"
        description="Browse verified properties for sale and rent across Nigeria."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <PropertyFilter current={type} />
          <p className="text-sm text-adab-gray-500">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </p>
        </div>
        <PropertyGrid properties={listings} />
      </div>
    </main>
  );
}
