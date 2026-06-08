export const siteConfig = {
  name: "Adab Real Estate Agency",
  shortName: "Adab",
  tagline: "Trusted property solutions across Nigeria",
  description:
    "Adab Real Estate Agency helps you buy, sell, and rent property across Nigeria with trusted local expertise.",
  location: "Nigeria",
  phone: "+234 812 827 2287",
  email: "hello@adab.ng",
  website: "https://adab.ng",
  whatsapp: "https://wa.me/2348128272287",
  logo: "/brand/logo.png",
  logoMark: "/brand/logo-mark.svg",
  favicon: "/brand/favicon.svg",
  ogImage: "/brand/og-image.png",
  nav: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "List Property", href: "/portal" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  colors: {
    navy: "#1B2A4A",
    gold: "#C9A227",
    gray: "#6b7280",
    paper: "#ffffff",
    cream: "#f8f6f1",
  },
} as const;

export type SiteConfig = typeof siteConfig;
