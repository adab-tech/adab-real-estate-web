"use client";

import { useState } from "react";
import type { InquiryTriageResult } from "@/lib/ai/schemas";

type InquiryAiPanelProps = {
  inquiry: {
    name: string;
    phone: string;
    email: string | null;
    message: string;
    source: string;
    property_slug: string | null;
  };
};

export function InquiryAiPanel({ inquiry }: InquiryAiPanelProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InquiryTriageResult | null>(null);

  async function handleTriage() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/inquiry-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          message: inquiry.message,
          source: inquiry.source,
          propertySlug: inquiry.property_slug,
        }),
      });

      const data = (await response.json()) as InquiryTriageResult & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Triage failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Triage failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4 border-t border-adab-gray-300 pt-4">
      <button
        type="button"
        onClick={handleTriage}
        disabled={pending}
        className="rounded-full border border-adab-navy-800/15 px-3 py-1.5 text-xs font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 disabled:opacity-50"
      >
        {pending ? "Analyzing…" : "AI triage & draft reply"}
      </button>

      {error ? (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-3 space-y-2 rounded-xl bg-adab-cream/80 p-4 text-sm">
          <p>
            <span className="font-semibold text-adab-navy-800">Priority:</span>{" "}
            <span className="capitalize">{result.priority}</span>
            {" · "}
            <span className="font-semibold text-adab-navy-800">Category:</span>{" "}
            <span className="capitalize">{result.category}</span>
          </p>
          <p className="text-adab-gray-500">{result.summary}</p>
          <p>
            <span className="font-semibold text-adab-navy-800">Next step:</span>{" "}
            {result.suggestedAction}
          </p>
          <div>
            <p className="font-semibold text-adab-navy-800">Draft reply</p>
            <p className="mt-1 whitespace-pre-wrap text-adab-navy-800">
              {result.draftReply}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
