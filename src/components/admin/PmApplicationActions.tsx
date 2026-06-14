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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const canReview = status === "submitted" || status === "reviewing";

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function approve() {
    setMessage(null);
    const result = await updateApplicationStatus(id, "approved");
    if (result?.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({
      type: "success",
      text: result?.success ?? "Application approved.",
    });
    refresh();
  }

  async function reject() {
    const notes = window.prompt("Reason for rejection (optional):");
    if (notes === null) return;

    setMessage(null);
    const result = await updateApplicationStatus(
      id,
      "rejected",
      notes.trim() || undefined,
    );
    if (result?.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({
      type: "success",
      text: result?.success ?? "Application rejected.",
    });
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
        onClick={() => void approve()}
        className="rounded-full bg-adab-gold-500 px-3 py-1 text-xs font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => void reject()}
        className="rounded-full border border-adab-gray-300 px-3 py-1 text-xs font-semibold text-adab-navy-800 hover:border-adab-navy-800 disabled:opacity-50"
      >
        Reject
      </button>
      {message ? (
        <span
          className={`text-xs ${
            message.type === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message.text}
        </span>
      ) : null}
    </div>
  );
}
