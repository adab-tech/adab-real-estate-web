import { siteConfig } from "@/lib/site-config";
import type {
  BrandTemplateConfig,
  BrandTemplateData,
  BrandTemplateType,
} from "@/lib/brand/types";

export const BRAND_COLORS = {
  navy: "#1B2A4A",
  navyDark: "#0F1A2E",
  gold: "#C9A227",
  cream: "#F8F6F1",
} as const;

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

export const brandTemplateConfigs: BrandTemplateConfig[] = [
  {
    id: "property-promo",
    name: "Property promo",
    description: "Square promo graphic for listings and ads.",
    category: "social",
    width: 1080,
    height: 1080,
    staticHtml: "/brand/downloads/promo/instagram-post.html",
    sharePlatforms: ["whatsapp", "instagram", "linkedin"],
  },
  {
    id: "instagram-post",
    name: "Instagram post",
    description: "1080×1080 feed post.",
    category: "social",
    width: 1080,
    height: 1080,
    staticHtml: "/brand/downloads/promo/instagram-post.html",
    sharePlatforms: ["instagram", "whatsapp"],
  },
  {
    id: "instagram-story",
    name: "Instagram story",
    description: "1080×1920 vertical story.",
    category: "social",
    width: 1080,
    height: 1920,
    staticHtml: "/brand/downloads/promo/instagram-story.html",
    sharePlatforms: ["instagram", "whatsapp"],
  },
  {
    id: "whatsapp-status",
    name: "WhatsApp status",
    description: "9:16 status graphic — prominent in Nigeria.",
    category: "social",
    width: 1080,
    height: 1920,
    staticHtml: "/brand/downloads/promo/whatsapp-property-status.html",
    sharePlatforms: ["whatsapp"],
  },
  {
    id: "linkedin-post",
    name: "LinkedIn post",
    description: "1200×627 professional share image.",
    category: "social",
    width: 1200,
    height: 627,
    sharePlatforms: ["linkedin"],
  },
  {
    id: "linkedin-cover",
    name: "LinkedIn cover",
    description: "1584×396 profile/banner cover.",
    category: "social",
    width: 1584,
    height: 396,
    sharePlatforms: ["linkedin"],
  },
  {
    id: "email-signature",
    name: "Email signature",
    description: "Branded block for Outlook and Gmail.",
    category: "office",
    width: 600,
    height: 180,
    staticHtml: "/brand/downloads/office/email-signature.html",
    sharePlatforms: [],
  },
  {
    id: "letterhead",
    name: "Letterhead",
    description: "A4 correspondence header.",
    category: "office",
    width: 794,
    height: 1123,
    staticHtml: "/brand/downloads/office/letterhead.html",
    sharePlatforms: [],
  },
  {
    id: "business-card",
    name: "Business card",
    description: "Print-ready staff card.",
    category: "office",
    width: 1011,
    height: 638,
    staticHtml: "/brand/downloads/office/business-card.html",
    sharePlatforms: [],
  },
  {
    id: "flyer-a5",
    name: "Flyer (A5)",
    description: "Compact A5 property handout.",
    category: "office",
    width: 559,
    height: 794,
    sharePlatforms: ["whatsapp"],
  },
  {
    id: "property-flyer",
    name: "Property flyer (A4)",
    description: "Detailed A4 listing flyer.",
    category: "office",
    width: 794,
    height: 1123,
    staticHtml: "/brand/downloads/office/property-flyer.html",
    sharePlatforms: ["whatsapp"],
  },
];

export function getTemplateConfig(
  type: BrandTemplateType,
): BrandTemplateConfig {
  return (
    brandTemplateConfigs.find((t) => t.id === type) ?? brandTemplateConfigs[0]
  );
}

export function getDefaultTemplateData(): BrandTemplateData {
  return {
    badge: "For Sale",
    title: "4-Bed Duplex · Gwarinpa",
    subtitle: "Verified title · View today",
    price: "₦185,000,000",
    location: "Gwarinpa, Abuja",
    description:
      "Spacious family duplex in a secure estate. Modern finishes, fitted kitchen, BQ, and ample parking. Ideal for executives and diaspora buyers.",
    agentName: "Your Full Name",
    agentTitle: "Property Consultant · Adab Real Estate Agency",
    agentPhone: siteConfig.phone,
    agentEmail: siteConfig.email,
    ctaLink: `${siteConfig.website}/properties`,
    ctaLabel: "adab.ng · WhatsApp us",
    whatsappLink: siteConfig.whatsapp,
    photoUrl: DEFAULT_PHOTO,
    bedrooms: "4",
    bathrooms: "5",
    sqm: "320",
  };
}

export function templateDataFromProperty(property: {
  title: string;
  slug: string;
  priceNGN: number;
  pricePeriod?: string;
  type: string;
  location: { area: string; city: string; state: string };
  beds?: number;
  baths?: number;
  sqm?: number;
  description: string;
  images: string[];
}): BrandTemplateData {
  const base = getDefaultTemplateData();
  const period =
    property.type === "rent" && property.pricePeriod
      ? ` / ${property.pricePeriod}`
      : "";
  const badge = property.type === "rent" ? "For Rent" : "For Sale";

  return {
    ...base,
    badge,
    title: property.title,
    subtitle: `${property.location.area} · ${property.location.city}`,
    price: `₦${property.priceNGN.toLocaleString("en-NG")}${period}`,
    location: `${property.location.area}, ${property.location.city}`,
    description: property.description.slice(0, 280),
    ctaLink: `${siteConfig.website}/properties/${property.slug}`,
    ctaLabel: "View on adab.ng",
    photoUrl: property.images[0] ?? base.photoUrl,
    bedrooms: property.beds?.toString() ?? base.bedrooms,
    bathrooms: property.baths?.toString() ?? base.bathrooms,
    sqm: property.sqm?.toString() ?? base.sqm,
  };
}
