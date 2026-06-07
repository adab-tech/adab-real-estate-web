import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { getFeaturedProperties } from "@/lib/properties";

export function FeaturedProperties() {
  const featured = getFeaturedProperties(3);

  return (
    <section className="bg-adab-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-adab-navy-800">
              Featured properties
            </h2>
            <p className="mt-2 text-adab-gray-500">
              Hand-picked listings across Lagos, Abuja, and beyond
            </p>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          >
            View all →
          </Link>
        </div>
        <PropertyGrid properties={featured} />
      </div>
    </section>
  );
}
