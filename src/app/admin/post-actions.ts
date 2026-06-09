"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseGallery,
  parseTags,
  postFormSchema,
} from "@/lib/admin/post-form";
import { revalidatePostPages } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/supabase/auth-server";

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

function toIsoDate(value: string): string | null {
  if (!value.trim()) return null;
  return new Date(`${value}T12:00:00`).toISOString();
}

function toPostRow(
  values: ReturnType<typeof postFormSchema.parse>,
  authorId: string,
) {
  const tags = parseTags(values.tags);
  const gallery = parseGallery(values.gallery);
  const publishedAt =
    values.status === "published"
      ? toIsoDate(values.publishedAt) ?? new Date().toISOString()
      : toIsoDate(values.publishedAt);
  const scheduledAt =
    values.status === "scheduled" ? toIsoDate(values.scheduledAt) : null;

  return {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    body_html: values.bodyHtml,
    tags,
    cover_image: values.coverImage || null,
    gallery,
    post_type: values.postType,
    status: values.status,
    author_id: authorId,
    published_at: publishedAt,
    scheduled_at: scheduledAt,
  };
}

export async function createPostAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const parsed = postFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const row = toPostRow(parsed.data, user.id);

  const { data, error } = await supabase
    .from("posts")
    .insert(row)
    .select("id, slug")
    .single();

  if (error) return { error: error.message };

  revalidatePostPages(row.slug);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${data.id}/edit?saved=1`);
}

export async function updatePostAction(
  postId: string,
  oldSlug: string,
  formData: FormData,
) {
  const { supabase, user } = await requireAdmin();
  const parsed = postFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const row = toPostRow(parsed.data, user.id);

  const { error } = await supabase.from("posts").update(row).eq("id", postId);

  if (error) return { error: error.message };

  revalidatePostPages(row.slug, oldSlug);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${postId}/edit?saved=1`);
}

export async function deletePostAction(postId: string, slug: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) return { error: error.message };

  revalidatePostPages(slug);
  revalidatePath("/admin/posts");
  redirect("/admin/posts?deleted=1");
}
