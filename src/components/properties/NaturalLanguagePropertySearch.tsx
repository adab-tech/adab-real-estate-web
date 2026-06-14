"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NaturalLanguagePropertySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setError("Describe what you're looking for in a few words.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/property-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = (await response.json()) as {
        error?: string;
        filters?: Record<string, string | number | undefined>;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed.");
      }

      const params = new URLSearchParams();
      const filters = data.filters ?? {};
      if (filters.type && filters.type !== "all") {
        params.set("type", String(filters.type));
      }
      if (filters.state) params.set("state", String(filters.state));
      if (filters.city) params.set("city", String(filters.city));
      if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
      if (filters.beds) params.set("beds", String(filters.beds));

      const qs = params.toString();
      router.push(qs ? `/properties?${qs}` : "/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-dashed border-adab-gold-500/50 bg-adab-gold-500/5 p-5"
    >
      <label
        htmlFor="nl-search"
        className="mb-2 block text-sm font-semibold text-adab-navy-800"
      >
        Search in plain English
      </label>
      <div className="flex flex-col gap-3 tablet:flex-row">
        <input
          id="nl-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='e.g. "3 bedroom flat for rent in Lekki under 5 million"'
          className="flex-1 rounded-xl border border-adab-gray-300 px-4 py-3 text-sm text-adab-navy-800 outline-none focus:border-adab-gold-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-adab-gold-500 px-5 py-3 text-sm font-semibold text-adab-navy-900 transition-colors hover:bg-adab-gold-400 disabled:opacity-50"
        >
          {pending ? "Searching…" : "AI search"}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-adab-gray-500">
          Powered by AI — converts your description into property filters.
        </p>
      )}
    </form>
  );
}
