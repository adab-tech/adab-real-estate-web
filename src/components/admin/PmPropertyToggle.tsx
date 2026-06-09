"use client";

import { useTransition } from "react";
import { togglePropertyManagement } from "@/app/admin/pm-actions";

type PmPropertyToggleProps = {
  propertyId: string;
  underManagement: boolean;
};

export function PmPropertyToggle({
  propertyId,
  underManagement,
}: PmPropertyToggleProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await togglePropertyManagement(propertyId, !underManagement);
        });
      }}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60 ${
        underManagement
          ? "bg-adab-gold-500 text-adab-navy-900"
          : "bg-adab-cream text-adab-gray-500 hover:bg-adab-gray-300"
      }`}
    >
      {underManagement ? "Under management" : "Mark managed"}
    </button>
  );
}
