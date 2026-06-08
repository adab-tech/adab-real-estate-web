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
    id: "logo-mark",
    name: "Logo Mark",
    description: "Square icon mark for avatars, app icons, and small placements.",
    preview: "/brand/logo-mark.svg",
    files: [
      { label: "SVG", href: "/brand/downloads/logo-mark.svg", format: "SVG" },
      { label: "PNG", href: "/brand/downloads/logo-mark.png", format: "PNG" },
    ],
  },
  {
    id: "logo-mark-white",
    name: "Logo Mark (Navy)",
    description: "Mark on navy background for social profiles and dark UI.",
    preview: "/brand/logo-mark-white.svg",
    files: [
      { label: "SVG", href: "/brand/downloads/logo-mark-white.svg", format: "SVG" },
      { label: "PNG", href: "/brand/downloads/logo-mark-white.png", format: "PNG" },
    ],
  },
  {
    id: "favicon",
    name: "Favicon",
    description: "Browser tab icon for websites and bookmarks.",
    preview: "/brand/favicon.svg",
    files: [
      { label: "SVG", href: "/brand/downloads/favicon.svg", format: "SVG" },
      { label: "ICO", href: "/brand/downloads/favicon.ico", format: "ICO" },
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

export const brandColors = [
  { name: "Adab Navy", hex: "#1B2A4A", class: "bg-adab-navy-800" },
  { name: "Adab Navy Dark", hex: "#0F1A2E", class: "bg-adab-navy-900" },
  { name: "Adab Gold", hex: "#C9A227", class: "bg-adab-gold-500" },
  { name: "Adab Cream", hex: "#F8F6F1", class: "bg-adab-cream" },
] as const;
