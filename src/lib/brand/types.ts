export type BrandTemplateType =
  | "property-promo"
  | "instagram-post"
  | "instagram-story"
  | "whatsapp-status"
  | "linkedin-post"
  | "linkedin-cover"
  | "email-signature"
  | "letterhead"
  | "business-card"
  | "flyer-a5"
  | "property-flyer";

export type BrandTemplateCategory = "social" | "office";

export type BrandTemplateData = {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  description: string;
  agentName: string;
  agentTitle: string;
  agentPhone: string;
  agentEmail: string;
  ctaLink: string;
  ctaLabel: string;
  whatsappLink: string;
  photoUrl: string;
  bedrooms: string;
  bathrooms: string;
  sqm: string;
};

export type BrandTemplateDraft = {
  id: string;
  user_id: string;
  template_type: BrandTemplateType;
  name: string | null;
  payload: BrandTemplateData;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BrandTemplateConfig = {
  id: BrandTemplateType;
  name: string;
  description: string;
  category: BrandTemplateCategory;
  width: number;
  height: number;
  staticHtml?: string;
  sharePlatforms: ("whatsapp" | "instagram" | "linkedin")[];
};
