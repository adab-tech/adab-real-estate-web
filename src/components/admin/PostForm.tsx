"use client";

import { useState } from "react";
import {
  createPostAction,
  deletePostAction,
  unpublishPostAction,
  updatePostAction,
} from "@/app/admin/post-actions";
import { CmsMediaUpload } from "@/components/admin/CmsMediaUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  galleryToString,
  parseGallery,
  slugifyTitle,
  tagsToString,
} from "@/lib/admin/post-form";
import {
  POST_STATUS_LABELS,
  POST_TYPE_LABELS,
  type Post,
} from "@/types/post";

type PostFormProps = {
  post?: Post;
  mode: "create" | "edit";
};

const inputClass =
  "w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm outline-none focus:border-adab-gold-500";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-adab-gray-500";

export function PostForm({ post, mode }: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [bodyHtml, setBodyHtml] = useState(post?.bodyHtml ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [gallery, setGallery] = useState(
    post ? galleryToString(post.gallery) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  }

  function appendGallery(url: string) {
    setGallery((current) => (current ? `${current}\n${url}` : url));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("bodyHtml", bodyHtml);
    formData.set("coverImage", coverImage);

    const action =
      mode === "create"
        ? createPostAction
        : (data: FormData) => updatePostAction(post!.id, post!.slug, data);

    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setPending(true);
    const result = await deletePostAction(post.id, post.slug);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  const galleryList = parseGallery(gallery);
  const defaultPublished =
    post?.publishedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const defaultScheduled = post?.scheduledAt?.slice(0, 10) ?? "";

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="grid gap-4 tablet:grid-cols-2">
        <Field label="Title" name="title">
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="URL slug" name="slug">
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </Field>

        <div className="tablet:col-span-2">
          <Field label="Excerpt" name="excerpt">
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              maxLength={500}
              defaultValue={post?.excerpt}
              className={inputClass}
              placeholder="Short summary for listings and social previews"
            />
          </Field>
        </div>

        <Field label="Tags (comma-separated)" name="tags">
          <input
            id="tags"
            name="tags"
            defaultValue={post ? tagsToString(post.tags) : ""}
            className={inputClass}
            placeholder="news, promo, lagos"
          />
        </Field>

        <Field label="Post type" name="postType">
          <select
            id="postType"
            name="postType"
            defaultValue={post?.postType ?? "blog"}
            className={inputClass}
          >
            {Object.entries(POST_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" name="status">
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className={inputClass}
          >
            {Object.entries(POST_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Published date" name="publishedAt">
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={defaultPublished}
            className={inputClass}
          />
        </Field>

        <Field label="Scheduled date" name="scheduledAt">
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="date"
            defaultValue={defaultScheduled}
            className={inputClass}
          />
        </Field>

        <div className="flex items-end tablet:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-adab-navy-800">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={post?.featured}
              className="h-4 w-4 rounded border-adab-gray-300 text-adab-gold-500"
            />
            Feature on updates page
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className={labelClass}>Body</p>
          <RichTextEditor slug={slug} value={bodyHtml} onChange={setBodyHtml} />
          <input type="hidden" name="bodyHtml" value={bodyHtml} />
        </div>
      </section>

      <section className="space-y-4">
        <CmsMediaUpload
          slug={slug}
          label="Upload cover image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onUploaded={setCoverImage}
        />

        <Field label="Cover image URL" name="coverImage">
          <input
            id="coverImage"
            name="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
        </Field>

        {coverImage && (
          <img
            src={coverImage}
            alt="Cover preview"
            className="h-32 w-full max-w-md rounded-xl object-cover"
          />
        )}

        <CmsMediaUpload
          slug={slug}
          label="Add gallery media"
          onUploaded={appendGallery}
        />

        <Field label="Gallery URLs (one per line)" name="gallery">
          <textarea
            id="gallery"
            name="gallery"
            rows={4}
            value={gallery}
            onChange={(e) => setGallery(e.target.value)}
            className={inputClass}
          />
        </Field>

        {galleryList.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {galleryList.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="h-20 w-28 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-adab-gray-300 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-adab-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700 disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create post"
              : "Save changes"}
        </button>

        {mode === "edit" && post && (
          <>
            {post.status === "published" && (
              <>
                <a
                  href={`/updates/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-adab-gray-300 px-6 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-white"
                >
                  View on site
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Unpublish "${post.title}"?`)) return;
                    setPending(true);
                    const result = await unpublishPostAction(post.id, post.slug);
                    if (result?.error) {
                      setError(result.error);
                      setPending(false);
                    }
                  }}
                  disabled={pending}
                  className="rounded-full border border-adab-gray-300 px-6 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-white disabled:opacity-60"
                >
                  Unpublish
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Delete post
            </button>
          </>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  children: React.ReactNode;
};

function Field({ label, name, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
