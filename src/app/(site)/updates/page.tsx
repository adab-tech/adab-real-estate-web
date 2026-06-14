import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/posts/PostCard";
import { getPublishedPosts } from "@/lib/supabase/posts";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "Updates",
  description:
    "News, promos, announcements, and releases from Adab Real Estate Agency.",
  openGraph: {
    title: `Updates | ${siteConfig.shortName}`,
    description:
      "News, promos, announcements, and releases from Adab Real Estate Agency.",
    url: absoluteUrl("/updates"),
  },
  alternates: { canonical: absoluteUrl("/updates") },
};

export default async function UpdatesPage() {
  const posts = await getPublishedPosts();

  return (
    <main>
      <PageHeader
        title="Updates"
        description="News, promos, announcements, and releases from Adab Real Estate."
      />

      <div className="site-container py-12">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-center text-sm text-adab-gray-500">
            No updates published yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
