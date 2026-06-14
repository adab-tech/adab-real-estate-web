"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type PmStatusSelectProps = {
  id: string;
  current: string;
  options: { value: string; label: string }[];
  action: (
    id: string,
    status: string,
  ) => Promise<{ error?: string; success?: string } | null>;
};

export function PmStatusSelect({
  id,
  current,
  options,
  action,
}: PmStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-1">
      <select
        className="rounded-lg border border-adab-gray-300 px-2 py-1 text-xs font-semibold text-adab-navy-800"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const previous = value;
          setValue(next);
          setMessage(null);
          startTransition(async () => {
            const result = await action(id, next);
            if (result?.error) {
              setValue(previous);
              setMessage({ type: "error", text: result.error });
              return;
            }
            setMessage({
              type: "success",
              text: result?.success ?? "Updated.",
            });
            router.refresh();
          });
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {message ? (
        <p
          className={`text-xs ${
            message.type === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
