import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { mapPostRow, type PostRow } from "@/lib/supabase/posts";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const post = mapPostRow(data as PostRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Edit post
          </h1>
          <p className="mt-1 text-sm text-adab-gray-500">{post.title}</p>
        </div>
        {post.status === "published" && (
          <Link
            href={`/updates/${post.slug}`}
            target="_blank"
            className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          >
            View on site →
          </Link>
        )}
      </div>

      {query.saved === "1" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Saved. The public site has been refreshed.
        </p>
      )}

      <PostForm post={post} mode="edit" />
    </div>
  );
}
