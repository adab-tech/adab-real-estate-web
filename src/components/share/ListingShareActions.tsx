"use client";

import { ShareButtons } from "@/components/posts/ShareButtons";
import { absoluteUrl } from "@/lib/seo";

type ListingShareActionsProps = {
  slug: string;
  title: string;
  status: string;
  compact?: boolean;
};

export function ListingShareActions({
  slug,
  title,
  status,
  compact = false,
}: ListingShareActionsProps) {
  if (status !== "published") return null;

  const url = absoluteUrl(`/properties/${slug}`);

  if (compact) {
    return (
      <div className="mt-2">
        <ShareButtons url={url} title={title} />
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-adab-gray-200 bg-adab-cream/50 p-4">
      <p className="text-sm font-semibold text-adab-navy-800">Share this listing</p>
      <p className="mt-1 text-xs text-adab-gray-500">{url.replace(/^https?:\/\//, "")}</p>
      <div className="mt-3">
        <ShareButtons url={url} title={title} />
      </div>
    </div>
  );
}
