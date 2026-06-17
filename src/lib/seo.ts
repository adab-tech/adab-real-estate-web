import type { Metadata } from "next";
import { PRODUCTION_URL } from "@/lib/domain";
import { formatLocation, formatPropertyPrice } from "@/lib/format";
import {
  getListerDisplayName,
  listerTypeLabel,
  type PublicListerProfile,
} from "@/lib/lister/profile";
import { siteConfig } from "@/lib/site-config";
import type { Post } from "@/types/post";
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

export type DynamicOgParams = {
  title: string;
  price?: string;
  location?: string;
  image?: string;
};

export function buildDynamicOgUrl(params: DynamicOgParams): string {
  const search = new URLSearchParams();
  search.set("title", params.title);
  if (params.price) search.set("price", params.price);
  if (params.location) search.set("location", params.location);
  if (params.image) search.set("image", params.image);
  return absoluteUrl(`/api/og/property?${search.toString()}`);
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
    icons: {
      icon: [
        { url: siteConfig.favicon, sizes: "32x32" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: siteConfig.favicon,
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

export function buildPostMetadata(post: Post): Metadata {
  const url = absoluteUrl(`/updates/${post.slug}`);
  const description = post.excerpt || post.title;

  return {
    title: post.title,
    description,
    keywords: post.tags.length > 0 ? post.tags : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags.length > 0 ? post.tags : undefined,
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.title }]
        : [{ url: absoluteUrl(siteConfig.ogImage), alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

export function buildArticleJsonLd(post: Post) {
  const url = absoluteUrl(`/updates/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    url,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
      },
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
export function buildListerMetadata(
  profile: PublicListerProfile,
  properties: Property[],
): Metadata {
  const displayName = getListerDisplayName(profile);
  const url = absoluteUrl(`/l/${profile.publicUsername}`);
  const count = properties.length;
  const description =
    count === 0
      ? `${displayName} on Adab.ng - Nigerian property listings.`
      : `Browse ${count} ${count === 1 ? "property" : "properties"} listed by ${displayName} on Adab.ng.`;
  const image = properties[0]?.images[0];

  return {
    title: displayName,
    description,
    openGraph: {
      type: "profile",
      url,
      title: `${displayName} | ${siteConfig.shortName}`,
      description,
      images: image
        ? [{ url: image, alt: displayName }]
        : [{ url: absoluteUrl(siteConfig.ogImage), alt: displayName }],
    },
    twitter: {
      card: "summary_large_image",
      title: displayName,
      description,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: url },
  };
}
