"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateApplicationStatus } from "@/app/admin/pm-actions";
import type { ApplicationStatus } from "@/types/tenant-portal";

type PmApplicationActionsProps = {
  id: string;
  status: ApplicationStatus;
};

export function PmApplicationActions({ id, status }: PmApplicationActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const canReview = status === "submitted" || status === "reviewing";

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function approve() {
    const result = await updateApplicationStatus(id, "approved");
    setMessage(result?.error ?? result?.success ?? null);
    refresh();
  }

  async function reject() {
    const notes = window.prompt("Reason for rejection (optional):");
    if (notes === null) return;
    const result = await updateApplicationStatus(
      id,
      "rejected",
      notes.trim() || undefined,
    );
    setMessage(result?.error ?? result?.success ?? null);
    refresh();
  }

  if (!canReview) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(approve)}
        className="rounded-full bg-adab-gold-500 px-3 py-1 text-xs font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(reject)}
        className="rounded-full border border-adab-gray-300 px-3 py-1 text-xs font-semibold text-adab-navy-800 hover:border-adab-navy-800 disabled:opacity-50"
      >
        Reject
      </button>
      {message ? (
        <span className="text-xs text-adab-gray-500">{message}</span>
      ) : null}
    </div>
  );
}
