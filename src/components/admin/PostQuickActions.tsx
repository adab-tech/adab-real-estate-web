"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  togglePostFeaturedAction,
  unpublishPostAction,
} from "@/app/admin/post-actions";
import type { Post } from "@/types/post";

type PostQuickActionsProps = {
  post: Post;
};

export function PostQuickActions({ post }: PostQuickActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await togglePostFeaturedAction(post.id, post.slug, !post.featured);
            refresh();
          });
        }}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          post.featured
            ? "bg-adab-gold-500 text-adab-navy-900"
            : "border border-adab-gray-300 text-adab-navy-800 hover:border-adab-gold-500"
        }`}
      >
        {post.featured ? "Featured" : "Feature"}
      </button>

      {post.status === "published" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(`Unpublish "${post.title}"?`)) return;
            startTransition(async () => {
              await unpublishPostAction(post.id, post.slug);
              refresh();
            });
          }}
          className="rounded-full border border-adab-gray-300 px-3 py-1 text-xs font-semibold text-adab-navy-800 hover:border-adab-gold-500"
        >
          Unpublish
        </button>
      )}

      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="text-xs font-semibold text-adab-navy-800 hover:text-adab-gold-500"
      >
        Edit
      </Link>
    </div>
  );
}
