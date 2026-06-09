"use client";

import { useTransition } from "react";
import { togglePostFeaturedAction } from "@/app/admin/post-actions";

type PostFeaturedToggleProps = {
  postId: string;
  slug: string;
  featured: boolean;
};

export function PostFeaturedToggle({
  postId,
  slug,
  featured,
}: PostFeaturedToggleProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await togglePostFeaturedAction(postId, slug, !featured);
        });
      }}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60 ${
        featured
          ? "bg-adab-gold-500 text-adab-navy-900"
          : "bg-adab-cream text-adab-gray-500 hover:bg-adab-gray-300"
      }`}
    >
      {featured ? "Featured" : "Feature"}
    </button>
  );
}
