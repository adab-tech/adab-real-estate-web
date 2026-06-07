import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  categoryLabel,
  formatLocation,
  formatPropertyPrice,
} from "@/lib/format";
import {
  getAllPropertySlugs,
  getPropertyBySlug,
} from "@/lib/properties";
import { buildListingJsonLd, buildPropertyMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPropertySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return buildPropertyMetadata(property);
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) notFound();

  const whatsappText = encodeURIComponent(
    `Hi Adab, I'm interested in: ${property.title} (${formatPropertyPrice(property.priceNGN, property.type, property.pricePeriod)})`,
  );
  const whatsappLink = `${siteConfig.whatsapp}?text=${whatsappText}`;

  return (
    <main>
      <JsonLd data={buildListingJsonLd(property)} />
      <div className="border-b border-adab-gray-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="text-sm font-medium text-adab-gray-500 hover:text-adab-navy-800"
          >
            ← Back to properties
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-adab-cream">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {property.images.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {property.images.slice(1).map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-adab-cream"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-adab-navy-800 sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 text-adab-gray-500">
                {formatLocation(property.location)} ·{" "}
                {categoryLabel(property.category)} ·{" "}
                {property.type === "sale" ? "For sale" : "For rent"}
              </p>
              <p className="mt-6 leading-relaxed text-adab-navy-700">
                {property.description}
              </p>

              <div className="mt-8">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-adab-navy-800">
                  Features
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-adab-navy-700"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-adab-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <PropertyMap property={property} />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
              <p className="text-2xl font-bold text-adab-gold-500">
                {formatPropertyPrice(
                  property.priceNGN,
                  property.type,
                  property.pricePeriod,
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-adab-navy-700">
                {property.beds ? <li>{property.beds} bedrooms</li> : null}
                {property.baths ? <li>{property.baths} bathrooms</li> : null}
                {property.sqm ? <li>{property.sqm} sqm</li> : null}
                <li>Status: {property.status.replace("_", " ")}</li>
              </ul>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-adab-gold-500 py-3 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-2xl border border-adab-gray-300 bg-white p-6">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-adab-navy-800">
                Request a viewing
              </h2>
              <p className="mt-2 text-sm text-adab-gray-500">
                Leave your details and our team will contact you within one
                business day.
              </p>
              <div className="mt-6">
                <InquiryForm
                  propertyId={property.id}
                  propertySlug={property.slug}
                  source="property_detail"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
