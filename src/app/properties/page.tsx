import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyFilter } from "@/components/properties/PropertyFilter";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertySearch } from "@/components/properties/PropertySearch";
import {
  filterProperties,
  parsePropertySearchParams,
} from "@/lib/properties";

export const metadata = {
  title: "Properties",
  description:
    "Search verified properties for sale and rent across Lagos, Abuja, Port Harcourt, and Nigeria.",
};

type PropertiesPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const filters = parsePropertySearchParams(params);
  const listings = filterProperties(filters);

  return (
    <main>
      <PageHeader
        title="Properties"
        description="Search verified properties for sale and rent across Nigeria."
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <PropertySearch filters={filters} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <PropertyFilter
            current={filters.type ?? "all"}
            searchFilters={filters}
          />
          <p className="text-sm text-adab-gray-500">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </p>
        </div>

        <PropertyGrid properties={listings} />
      </div>
    </main>
  );
}
