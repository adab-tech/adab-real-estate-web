import Link from "next/link";
import { PostFeaturedToggle } from "@/components/admin/PostFeaturedToggle";
import { PostQuickActions } from "@/components/admin/PostQuickActions";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { mapPostRow, type PostRow } from "@/lib/supabase/posts";
import { POST_STATUS_LABELS, POST_TYPE_LABELS } from "@/types/post";

type AdminPostsPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function AdminPostsPage({
  searchParams,
}: AdminPostsPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <p className="text-red-600">Failed to load posts: {error.message}</p>
    );
  }

  const posts = (data as PostRow[]).map(mapPostRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-adab-navy-800">
            Posts
          </h1>
          <p className="mt-1 text-sm text-adab-gray-500">
            {posts.length} updates, promos, and announcements
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-adab-gold-500 px-5 py-2.5 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
        >
          + New post
        </Link>
      </div>

      {params.deleted === "1" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Post deleted. The public site will update shortly.
        </p>
      )}

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No posts yet. Create your first update to appear on{" "}
          <Link href="/updates" className="font-semibold text-adab-navy-800">
            /updates
          </Link>
          .
        </p>
      ) : (
        <ResponsiveTable minWidth="48rem">
            <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-adab-gray-300 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-adab-navy-800">
                    {post.title}
                    <p className="text-xs font-normal text-adab-gray-500">
                      /updates/{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {POST_TYPE_LABELS[post.postType]}
                  </td>
                  <td className="px-4 py-3">
                    {POST_STATUS_LABELS[post.status]}
                  </td>
                  <td className="px-4 py-3">
                    <PostFeaturedToggle
                      postId={post.id}
                      slug={post.slug}
                      featured={post.featured}
                    />
                  </td>
                  <td className="px-4 py-3 text-adab-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-NG")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PostQuickActions post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
        </ResponsiveTable>
      )}
    </div>
  );
}
