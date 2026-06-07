import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { services } from "@/lib/services-content";

export const metadata = {
  title: "Services",
  description:
    "Buy, sell, rent, and manage property across Nigeria with Adab Real Estate Agency.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        title="Our services"
        description="End-to-end real estate services built for the Nigerian market."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(27,42,74,0.12)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-adab-navy-800 group-hover:text-adab-gold-500">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-adab-gray-500">
                {service.headline}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-adab-navy-800 group-hover:text-adab-gold-500">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
