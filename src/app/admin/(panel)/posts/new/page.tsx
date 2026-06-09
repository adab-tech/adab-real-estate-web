import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          New post
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Create blog posts, promos, announcements, or release notes for the
          public updates page.
        </p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
