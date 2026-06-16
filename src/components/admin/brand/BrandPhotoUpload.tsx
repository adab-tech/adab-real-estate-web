"use client";

import { useRef, useState } from "react";
import { uploadBrandImage } from "@/app/admin/brand-actions";

type BrandPhotoUploadProps = {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
};

export function BrandPhotoUpload({
  photoUrl,
  onPhotoChange,
}: BrandPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    const result = await uploadBrandImage(formData);

    if (result.ok) {
      onPhotoChange(result.url);
      setUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPhotoChange(reader.result);
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setError(result.error ?? "Upload failed");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = "";
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-adab-gray-300 bg-adab-cream/50 p-4">
      <label className="block text-sm font-semibold text-adab-navy-800">
        Property photo
      </label>

      {photoUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-adab-gray-300/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Preview"
            className="h-32 w-full object-cover"
          />
        </div>
      ) : null}

      <label className="block text-xs font-medium text-adab-gray-500">
        Photo URL
        <input
          type="url"
          value={photoUrl.startsWith("data:") ? "" : photoUrl}
          placeholder="https://… or upload below"
          onChange={(e) => onPhotoChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-adab-gray-300 px-3 py-2 text-sm text-adab-navy-800"
        />
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onInputChange}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-full border border-adab-navy-800/20 bg-white px-4 py-2 text-sm font-semibold text-adab-navy-800 hover:border-adab-gold-500 disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Upload photo"}
      </button>

      {error && (
        <p className="text-xs text-amber-700">
          Storage unavailable — using local preview. {error}
        </p>
      )}
    </div>
  );
}
