"use client";

import { useState } from "react";
import type { ApplicationSummaryResult } from "@/lib/ai/schemas";

type ApplicationAiSummaryProps = {
  application: {
    application_type: string;
    full_name: string;
    email: string;
    phone: string;
    property_interest: string | null;
    message: string | null;
    status: string;
  };
};

export function ApplicationAiSummary({ application }: ApplicationAiSummaryProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicationSummaryResult | null>(null);

  async function handleSummarize() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/application-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationType: application.application_type,
          fullName: application.full_name,
          email: application.email,
          phone: application.phone,
          propertyInterest: application.property_interest,
          message: application.message,
          status: application.status,
        }),
      });

      const data = (await response.json()) as ApplicationSummaryResult & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Summary failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summary failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleSummarize}
        disabled={pending}
        className="rounded-full border border-adab-navy-800/15 px-3 py-1 text-xs font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 disabled:opacity-50"
      >
        {pending ? "Summarizing…" : "AI summary"}
      </button>

      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-2 max-w-md space-y-2 rounded-lg bg-adab-cream/80 p-3 text-xs">
          <p className="text-adab-navy-800">{result.summary}</p>
          {result.strengths.length > 0 ? (
            <p>
              <span className="font-semibold">Strengths:</span>{" "}
              {result.strengths.join("; ")}
            </p>
          ) : null}
          {result.concerns.length > 0 ? (
            <p className="text-amber-800">
              <span className="font-semibold">Concerns:</span>{" "}
              {result.concerns.join("; ")}
            </p>
          ) : null}
          <p>
            <span className="font-semibold">Suggested status:</span>{" "}
            <span className="capitalize">{result.recommendedStatus}</span>
          </p>
          <p className="italic text-adab-gray-500">{result.reviewNotes}</p>
        </div>
      ) : null}
    </div>
  );
}
