"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteBrandDraft,
  duplicateBrandDraft,
} from "@/app/admin/brand-actions";
import type { BrandTemplateDraft, BrandTemplateType } from "@/lib/brand/types";
import { brandTemplateConfigs } from "@/lib/brand/templates";

type SavedDraftsListProps = {
  drafts: BrandTemplateDraft[];
  activeId?: string;
  onLoad: (draft: BrandTemplateDraft) => void;
  onDraftsChange?: (drafts: BrandTemplateDraft[]) => void;
};

export function SavedDraftsList({
  drafts,
  activeId,
  onLoad,
  onDraftsChange,
}: SavedDraftsListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (drafts.length === 0) {
    return (
      <p className="text-sm text-adab-gray-500">
        No saved templates yet. Customize fields and click Save draft.
      </p>
    );
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this saved template?")) return;
    startTransition(async () => {
      const result = await deleteBrandDraft(id);
      if (result.ok) {
        onDraftsChange?.(drafts.filter((d) => d.id !== id));
        router.refresh();
      }
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      await duplicateBrandDraft(id);
      router.refresh();
    });
  }

  const label = (type: BrandTemplateType) =>
    brandTemplateConfigs.find((t) => t.id === type)?.name ?? type;

  return (
    <ul className="space-y-2">
      {drafts.map((draft) => (
        <li
          key={draft.id}
          className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm ${
            draft.id === activeId
              ? "border-adab-gold-500 bg-adab-gold-500/10"
              : "border-adab-gray-300/60 bg-white"
          }`}
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-adab-navy-800">
              {draft.name ?? "Untitled"}
            </p>
            <p className="text-xs text-adab-gray-500">
              {label(draft.template_type)} ·{" "}
              {new Date(draft.updated_at).toLocaleDateString("en-NG")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => onLoad(draft)}
              className="rounded-full bg-adab-navy-800 px-3 py-1 text-xs font-semibold text-white hover:bg-adab-navy-700"
            >
              Load
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDuplicate(draft.id)}
              className="rounded-full border border-adab-gray-300 px-3 py-1 text-xs font-semibold text-adab-navy-800"
            >
              Duplicate
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDelete(draft.id)}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
