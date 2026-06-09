import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShareButtons } from "@/components/posts/ShareButtons";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllPublishedPostSlugs,
  getPublishedPostBySlug,
} from "@/lib/supabase/posts";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildPostMetadata,
} from "@/lib/seo";
import { POST_TYPE_LABELS } from "@/types/post";

export const revalidate = 60;

export const dynamicParams = true;

type PostDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Update not found" };
  return buildPostMetadata(post);
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const pageUrl = absoluteUrl(`/updates/${post.slug}`);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main>
      <JsonLd data={buildArticleJsonLd(post)} />

      <PageHeader title={post.title} description={post.excerpt || undefined} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-adab-navy-800 px-3 py-1 text-xs font-semibold text-white">
              {POST_TYPE_LABELS[post.postType]}
            </span>
            {date && <time className="text-adab-gray-500">{date}</time>}
          </div>
          <ShareButtons url={pageUrl} title={post.title} />
        </div>

        {post.coverImage && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-adab-cream">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-adab-cream px-3 py-1 text-xs font-medium text-adab-navy-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.bodyHtml ? (
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />
        ) : (
          post.excerpt && (
            <p className="text-lg leading-relaxed text-adab-gray-500">
              {post.excerpt}
            </p>
          )
        )}

        {post.gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {post.gallery.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-adab-gray-300 pt-8">
          <ShareButtons url={pageUrl} title={post.title} />
          <Link
            href="/updates"
            className="text-sm font-semibold text-adab-navy-800 hover:text-adab-gold-500"
          >
            ← All updates
          </Link>
        </div>
      </article>
    </main>
  );
}
