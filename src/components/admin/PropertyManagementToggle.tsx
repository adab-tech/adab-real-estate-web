"use client";

import { useTransition } from "react";
import { togglePropertyManagement } from "@/app/admin/pm-actions";

export function PropertyManagementToggle({
  propertyId,
  underManagement,
}: {
  propertyId: string;
  underManagement: boolean;
}) {
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        underManagement
          ? "bg-adab-gold-500 text-adab-navy-900"
          : "border border-adab-gray-300 text-adab-gray-500"
      }`}
    >
      {underManagement ? "Managed" : "Not managed"}
    </button>
  );
}
