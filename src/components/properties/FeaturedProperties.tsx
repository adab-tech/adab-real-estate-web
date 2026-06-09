import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { getFeaturedProperties } from "@/lib/properties";

export async function FeaturedProperties() {
  const featured = await getFeaturedProperties(3);

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
        {featured.length > 0 ? (
          <PropertyGrid properties={featured} />
        ) : (
          <p className="py-8 text-center text-adab-gray-500">
            New listings are being added.{" "}
            <Link
              href="/properties"
              className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
            >
              Browse all properties
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
