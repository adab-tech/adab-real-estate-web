export type PostType = "blog" | "promo" | "announcement" | "release";

export type PostStatus = "draft" | "published" | "scheduled";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  tags: string[];
  coverImage: string | null;
  gallery: string[];
  postType: PostType;
  status: PostStatus;
  authorId: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_html: string;
  tags: string[] | null;
  cover_image: string | null;
  gallery: string[] | null;
  post_type: PostType;
  status: PostStatus;
  author_id: string | null;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  blog: "Blog post",
  promo: "Promo offer",
  announcement: "Announcement",
  release: "Release / update",
};

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
  scheduled: "Scheduled",
};
