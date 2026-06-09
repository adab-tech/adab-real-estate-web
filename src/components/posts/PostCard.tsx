import Image from "next/image";
import Link from "next/link";
import { POST_TYPE_LABELS, type Post } from "@/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(27,42,74,0.12)]">
      <Link href={`/updates/${post.slug}`} className="block">
        {post.coverImage ? (
          <div className="relative aspect-[16/9] bg-adab-cream">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-adab-cream text-sm text-adab-gray-500">
            {POST_TYPE_LABELS[post.postType]}
          </div>
        )}

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-adab-navy-800 px-2.5 py-0.5 font-semibold text-white">
              {POST_TYPE_LABELS[post.postType]}
            </span>
            {date && <time className="text-adab-gray-500">{date}</time>}
          </div>

          <h2 className="font-display text-lg font-bold text-adab-navy-800">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-adab-gray-500">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-adab-cream px-2 py-0.5 text-xs text-adab-navy-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
