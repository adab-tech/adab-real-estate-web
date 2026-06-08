import type { Metadata } from "next";
import { PRODUCTION_URL } from "@/lib/domain";
import { formatPropertyPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import type { Property } from "@/types/property";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  return PRODUCTION_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export function buildDefaultMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    keywords: [
      "real estate Nigeria",
      "property Lagos",
      "property Abuja",
      "houses for sale Nigeria",
      "apartments for rent Lagos",
      "Adab Real Estate",
    ],
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: siteUrl,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildPropertyMetadata(property: Property): Metadata {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const price = formatPropertyPrice(
    property.priceNGN,
    property.type,
    property.pricePeriod,
  );

  return {
    title: property.title,
    description: property.description,
    openGraph: {
      type: "website",
      url,
      title: property.title,
      description: `${price} · ${property.location.area}, ${property.location.city}`,
      images: property.images[0]
        ? [{ url: property.images[0], alt: property.title }]
        : undefined,
    },
    alternates: { canonical: url },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl(),
    logo: absoluteUrl(siteConfig.logo),
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "English",
    },
  };
}

export function buildListingJsonLd(property: Property) {
  const url = absoluteUrl(`/properties/${property.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url,
    datePosted: property.publishedAt,
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.priceNGN,
      priceCurrency: "NGN",
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: property.location.area,
      addressRegion: property.location.state,
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.location.lat,
      longitude: property.location.lng,
    },
  };
}
