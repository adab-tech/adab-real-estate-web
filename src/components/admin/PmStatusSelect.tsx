"use client";

import { useTransition } from "react";

type PmStatusSelectProps = {
  id: string;
  current: string;
  options: { value: string; label: string }[];
  action: (id: string, status: string) => Promise<{ error?: string } | null>;
};

export function PmStatusSelect({
  id,
  current,
  options,
  action,
}: PmStatusSelectProps) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="rounded-lg border border-adab-gray-300 px-2 py-1 text-xs font-semibold text-adab-navy-800"
      value={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await action(id, next);
        });
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
