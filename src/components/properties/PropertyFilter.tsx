import Link from "next/link";
import type { ListingType, PropertyFilters } from "@/types/property";
import { buildQuery } from "@/lib/property-query";

type FilterValue = ListingType | "all";

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "For sale", value: "sale" },
  { label: "For rent", value: "rent" },
];

type PropertyFilterProps = {
  current?: string;
  searchFilters?: PropertyFilters;
};

export function PropertyFilter({
  current = "all",
  searchFilters = {},
}: PropertyFilterProps) {
  const active = filters.some((f) => f.value === current) ? current : "all";

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by listing type">
      {filters.map((filter) => {
        const isActive = active === filter.value;
        const href =
          filter.value === "all"
            ? `/properties${buildQuery({ ...searchFilters, type: "all" })}`
            : `/properties${buildQuery({ ...searchFilters, type: filter.value })}`;

        return (
          <Link
            key={filter.value}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-adab-navy-800 text-white"
                : "border border-adab-gray-300 bg-white text-adab-navy-800 hover:border-adab-gold-500 hover:text-adab-gold-500"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
