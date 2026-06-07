"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ImageUploadProps = {
  slug: string;
  onUploaded: (url: string) => void;
};

export function ImageUpload({ slug, onUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const safeSlug = slug || "uploads";
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const path = `${safeSlug}/${filename}`;

    const supabase = createSupabaseBrowserClient();
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(path);

    onUploaded(publicUrl);
    setUploading(false);
    event.target.value = "";
  }

  return (
    <div className="rounded-xl border border-dashed border-adab-gray-300 bg-adab-cream/50 p-4">
      <label className="block text-sm font-semibold text-adab-navy-800">
        Upload image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          disabled={uploading}
          className="mt-2 block w-full text-sm text-adab-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-adab-navy-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-adab-navy-700"
        />
      </label>
      {uploading && (
        <p className="mt-2 text-sm text-adab-gray-500">Uploading…</p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
