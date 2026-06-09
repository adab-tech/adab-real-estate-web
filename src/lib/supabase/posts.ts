import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { Post, PostRow } from "@/types/post";
import { createClient } from "@supabase/supabase-js";

function mapPostRow(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyHtml: row.body_html,
    tags: row.tags ?? [],
    coverImage: row.cover_image,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    postType: row.post_type,
    status: row.status,
    authorId: row.author_id,
    publishedAt: row.published_at,
    scheduledAt: row.scheduled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getPublicClient() {
  if (!isSupabaseConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as PostRow[]).map(mapPostRow);
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return mapPostRow(data as PostRow);
}

export async function getLatestAnnouncement(): Promise<Post | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .in("post_type", ["announcement", "promo"])
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapPostRow(data as PostRow);
}

export async function getAllPublishedPostSlugs(): Promise<string[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((row) => row.slug as string);
}

export { mapPostRow };
export type { PostRow };
