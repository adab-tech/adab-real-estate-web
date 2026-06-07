export type ServiceSlug = "buy" | "sell" | "rent" | "property-management";

export type ServiceContent = {
  slug: ServiceSlug;
  title: string;
  headline: string;
  description: string;
  benefits: string[];
  process: { step: string; detail: string }[];
  cta: string;
};

export const services: ServiceContent[] = [
  {
    slug: "buy",
    title: "Buy Property",
    headline: "Find the right property with local expertise",
    description:
      "Whether you are a first-time buyer or expanding your portfolio, Adab guides you through Nigeria's property market with verified listings, transparent pricing, and due diligence support.",
    benefits: [
      "Verified listings across Lagos, Abuja, and Port Harcourt",
      "Title and documentation review support",
      "Negotiation and offer management",
      "Mortgage and payment plan referrals",
      "Physical viewings with assigned agents",
    ],
    process: [
      { step: "Consult", detail: "Tell us your budget, location, and property type." },
      { step: "Shortlist", detail: "We curate matching listings from our portfolio and network." },
      { step: "View", detail: "Schedule inspections at times that work for you." },
      { step: "Close", detail: "We support offers, contracts, and handover." },
    ],
    cta: "Start your property search",
  },
  {
    slug: "sell",
    title: "Sell Property",
    headline: "Sell faster with professional marketing",
    description:
      "List your property with Adab to reach qualified buyers through targeted marketing, professional photography, and a network of agents active in Nigeria's key markets.",
    benefits: [
      "Professional listing presentation",
      "Buyer screening and lead qualification",
      "Market pricing guidance",
      "Viewing coordination and feedback",
      "Transaction support through to completion",
    ],
    process: [
      { step: "Valuation", detail: "We assess your property and recommend a listing price." },
      { step: "List", detail: "Your property goes live on our website and channels." },
      { step: "Market", detail: "We promote to our buyer database and partner network." },
      { step: "Sell", detail: "We manage offers and guide you to a successful sale." },
    ],
    cta: "List your property",
  },
  {
    slug: "rent",
    title: "Rent Property",
    headline: "Quality rentals for homes and businesses",
    description:
      "Find residential and commercial rentals with clear terms, verified landlords, and responsive support. We serve professionals, families, and companies relocating to Nigeria.",
    benefits: [
      "Residential and commercial rental options",
      "Transparent annual and monthly pricing in NGN",
      "Tenant screening for landlords",
      "Lease review and move-in coordination",
      "Ongoing support during tenancy",
    ],
    process: [
      { step: "Requirements", detail: "Share your preferred area, budget, and move-in date." },
      { step: "Match", detail: "We send suitable options with photos and full details." },
      { step: "Inspect", detail: "Visit shortlisted properties with our agents." },
      { step: "Move in", detail: "We help with lease signing and handover." },
    ],
    cta: "Browse rentals",
  },
  {
    slug: "property-management",
    title: "Property Management",
    headline: "Protect and grow your real estate investment",
    description:
      "Adab manages residential and commercial properties on behalf of owners — handling tenants, maintenance, rent collection, and reporting so your asset performs while you focus elsewhere.",
    benefits: [
      "Tenant sourcing and screening",
      "Rent collection and remittance",
      "Routine maintenance coordination",
      "Periodic property inspections",
      "Monthly owner reporting",
    ],
    process: [
      { step: "Onboard", detail: "Property inspection and management agreement." },
      { step: "Let", detail: "Marketing, viewings, and tenant placement." },
      { step: "Manage", detail: "Day-to-day operations and maintenance." },
      { step: "Report", detail: "Regular financial and condition updates." },
    ],
    cta: "Discuss management",
  },
];

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): ServiceSlug[] {
  return services.map((s) => s.slug);
}
