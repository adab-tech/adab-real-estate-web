"use client";

import { useState } from "react";

type ListingDetails = {
  title: string;
  type: string;
  category: string;
  price_ngn: string;
  price_period: string;
  area: string;
  city: string;
  state: string;
  beds: string;
  baths: string;
  sqm: string;
  features: string;
};

type AiDescriptionButtonProps = {
  form: ListingDetails;
  onGenerated: (description: string) => void;
};

export function AiDescriptionButton({
  form,
  onGenerated,
}: AiDescriptionButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!form.title.trim()) {
      setError("Enter a property title first.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const priceNgn = parseInt(form.price_ngn, 10);
      if (!Number.isFinite(priceNgn)) {
        throw new Error("Enter a valid price first.");
      }

      const response = await fetch("/api/ai/listing-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          type: form.type,
          category: form.category,
          priceNgn,
          pricePeriod: form.type === "rent" ? form.price_period : undefined,
          area: form.area.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          beds: form.beds ? parseInt(form.beds, 10) : undefined,
          baths: form.baths ? parseInt(form.baths, 10) : undefined,
          sqm: form.sqm ? parseFloat(form.sqm) : undefined,
          features: form.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        description?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed.");
      }

      if (data.description) {
        onGenerated(data.description);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={pending}
        className="rounded-full border border-adab-gold-500/40 bg-adab-gold-500/10 px-4 py-1.5 text-xs font-semibold text-adab-navy-800 transition-colors hover:bg-adab-gold-500/20 disabled:opacity-50"
      >
        {pending ? "Generating…" : "Generate with AI"}
      </button>
      {error ? (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
