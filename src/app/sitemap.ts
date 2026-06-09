import type { MetadataRoute } from "next";
import { getAllPropertySlugs } from "@/lib/properties";
import { getAllPublishedPostSlugs } from "@/lib/supabase/posts";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/properties`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/updates`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const slugs = await getAllPropertySlugs();
  const propertyRoutes: MetadataRoute.Sitemap = slugs.map(
    (slug) => ({
      url: `${base}/properties/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const serviceRoutes: MetadataRoute.Sitemap = [
    "buy",
    "sell",
    "rent",
    "property-management",
  ].map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postSlugs = await getAllPublishedPostSlugs();
  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${base}/updates/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...propertyRoutes, ...postRoutes];
}
