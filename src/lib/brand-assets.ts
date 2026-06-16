export type BrandAsset = {
  id: string;
  name: string;
  description: string;
  preview: string;
  files: { label: string; href: string; format: string }[];
};

export const brandKitZip = "/brand/adab-brand-kit.zip";

export const brandAssets: BrandAsset[] = [
  {
    id: "logo-primary",
    name: "Primary Logo",
    description: "Full logo for light backgrounds, print, and documents.",
    preview: "/brand/logo.png",
    files: [
      { label: "PNG", href: "/brand/logo.png", format: "PNG" },
      { label: "PNG (kit)", href: "/brand/downloads/logo-primary.png", format: "PNG" },
    ],
  },
  {
    id: "favicon",
    name: "Favicon",
    description: "Browser tab icon derived from the official primary logo.",
    preview: "/brand/favicon-32.png",
    files: [
      { label: "ICO", href: "/brand/favicon.ico", format: "ICO" },
      { label: "ICO (kit)", href: "/brand/downloads/favicon.ico", format: "ICO" },
      { label: "PNG", href: "/brand/downloads/favicon-512.png", format: "PNG" },
    ],
  },
  {
    id: "nigeria-flag",
    name: "Nigeria Flag",
    description: "Animated Nigerian flag for web footers and patriotic accents.",
    preview: "/brand/nigeria-flag.svg",
    files: [
      { label: "SVG", href: "/brand/downloads/nigeria-flag.svg", format: "SVG" },
    ],
  },
  {
    id: "cac-seal",
    name: "CAC Registration Seal",
    description:
      "Official Corporate Affairs Commission seal for footer registration display only — not an Adab brand logo.",
    preview: "/brand/cac-logo.png",
    files: [
      { label: "PNG", href: "/brand/cac-logo.png", format: "PNG" },
      { label: "PNG (kit)", href: "/brand/downloads/cac-logo.png", format: "PNG" },
    ],
  },
  {
    id: "og-image",
    name: "Social Share Image",
    description: "Open Graph image for link previews on social media (1200×630).",
    preview: "/brand/og-image.png",
    files: [
      { label: "PNG", href: "/brand/downloads/og-image.png", format: "PNG" },
    ],
  },
  {
    id: "brand-colors",
    name: "Brand Colors Reference",
    description: "Color swatches, hex codes, and typography guidelines.",
    preview: "/brand/downloads/brand-colors.html",
    files: [
      { label: "HTML", href: "/brand/downloads/brand-colors.html", format: "HTML" },
      { label: "README", href: "/brand/downloads/README.md", format: "MD" },
    ],
  },
];

export const officeTemplates: BrandAsset[] = [
  {
    id: "business-card",
    name: "Business Card",
    description: "Print-ready business card template for Adab staff.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/office/business-card.html",
        format: "HTML",
      },
    ],
  },
  {
    id: "email-signature",
    name: "Email Signature",
    description: "Branded email signature block for Outlook and Gmail.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/office/email-signature.html",
        format: "HTML",
      },
    ],
  },
  {
    id: "letterhead",
    name: "Letterhead",
    description: "Official letterhead template for correspondence.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/office/letterhead.html",
        format: "HTML",
      },
    ],
  },
  {
    id: "property-flyer",
    name: "Property Flyer",
    description: "Promotional property listing flyer template.",
    preview: "/brand/og-image.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/office/property-flyer.html",
        format: "HTML",
      },
    ],
  },
];

export const promoTemplates: BrandAsset[] = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    description: "1080×1080 square graphic for feed posts.",
    preview: "/brand/og-image.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/promo/instagram-post.html",
        format: "HTML",
      },
      { label: "Editor", href: "/admin/brand/editor", format: "APP" },
    ],
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    description: "1080×1920 vertical story template.",
    preview: "/brand/og-image.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/promo/instagram-story.html",
        format: "HTML",
      },
      { label: "Editor", href: "/admin/brand/editor", format: "APP" },
    ],
  },
  {
    id: "whatsapp-property-status",
    name: "WhatsApp Property Status",
    description: "9:16 status graphic for WhatsApp and similar channels.",
    preview: "/brand/og-image.png",
    files: [
      {
        label: "HTML",
        href: "/brand/downloads/promo/whatsapp-property-status.html",
        format: "HTML",
      },
      { label: "Editor", href: "/admin/brand/editor", format: "APP" },
    ],
  },
];

export const corporateWordTemplates: BrandAsset[] = [
  {
    id: "corporate-profile-doc",
    name: "Corporate profile (Word)",
    description: "Company overview document for proposals.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "DOC",
        href: "/brand/downloads/office/word/corporate-profile.doc",
        format: "DOC",
      },
    ],
  },
  {
    id: "property-listing-sheet-doc",
    name: "Property listing sheet (Word)",
    description: "Offline listing details template.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "DOC",
        href: "/brand/downloads/office/word/property-listing-sheet.doc",
        format: "DOC",
      },
    ],
  },
  {
    id: "tenant-application-form-doc",
    name: "Tenant application (Word)",
    description: "Printable tenant application form.",
    preview: "/brand/logo.png",
    files: [
      {
        label: "DOC",
        href: "/brand/downloads/office/word/tenant-application-form.doc",
        format: "DOC",
      },
    ],
  },
];

export const brandColors = [
  { name: "Adab Navy", hex: "#1B2A4A", class: "bg-adab-navy-800" },
  { name: "Adab Navy Dark", hex: "#0F1A2E", class: "bg-adab-navy-900" },
  { name: "Adab Gold", hex: "#C9A227", class: "bg-adab-gold-500" },
  { name: "Adab Cream", hex: "#F8F6F1", class: "bg-adab-cream" },
] as const;
