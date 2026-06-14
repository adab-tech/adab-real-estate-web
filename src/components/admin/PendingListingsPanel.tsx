"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  approveListingAdmin,
  rejectListingAdmin,
} from "@/app/admin/listing-actions";
import { formatNaira } from "@/lib/portal/format";

type PendingListing = {
  id: string;
  title: string;
  description: string;
  price_ngn: number;
  images: string[];
  location: { area?: string; city?: string; state?: string };
  profiles: {
    full_name?: string | null;
    email?: string | null;
    lister_type?: string | null;
  } | null;
};

export function PendingListingsPanel({
  listings: initialListings,
}: {
  listings: PendingListing[];
}) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [pending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function approve(id: string) {
    setActingId(id);
    setMessage(null);
    const result = await approveListingAdmin(id);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setActingId(null);
      return;
    }
    setListings((current) => current.filter((item) => item.id !== id));
    setMessage({
      type: "success",
      text: result.success ?? "Listing approved and published.",
    });
    setActingId(null);
    refresh();
  }

  async function reject(id: string) {
    const reason = window.prompt(
      "Reason for rejection (shown to lister):",
      "Please update photos and property details.",
    );
    if (reason === null) return;

    setActingId(id);
    setMessage(null);
    const result = await rejectListingAdmin(id, reason);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setActingId(null);
      return;
    }
    setListings((current) => current.filter((item) => item.id !== id));
    setMessage({
      type: "success",
      text: result.success ?? "Listing rejected.",
    });
    setActingId(null);
    refresh();
  }

  if (!listings.length) {
    return (
      <div className="space-y-4">
        {message && (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {message.text}
          </p>
        )}
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No listings awaiting approval.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {message.text}
        </p>
      )}
      {listings.map((item) => {
        const owner = item.profiles ?? {};
        const place = [item.location?.area, item.location?.city, item.location?.state]
          .filter(Boolean)
          .join(", ");
        const busy = pending || actingId === item.id;

        return (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-sm tablet:flex-row"
          >
            {item.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.images[0]}
                alt=""
                className="h-28 w-full rounded-xl object-cover tablet:w-36"
              />
            ) : (
              <div className="flex h-28 w-full items-center justify-center rounded-xl bg-adab-cream text-xs text-adab-gray-500 tablet:w-36">
                No image
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-adab-navy-800">{item.title}</h3>
              <p className="text-sm text-adab-gray-500">
                {place} · {formatNaira(item.price_ngn)}
              </p>
              <p className="mt-1 text-xs text-adab-gray-500">
                Submitted by {owner.full_name || owner.email || "Unknown"}
                {owner.lister_type ? ` (${owner.lister_type})` : ""}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-adab-navy-700">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => approve(item.id)}
                  className="rounded-full bg-adab-gold-500 px-4 py-2 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
                >
                  {actingId === item.id ? "Approving…" : "Approve & publish"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => reject(item.id)}
                  className="rounded-full border border-adab-gray-300 px-4 py-2 text-sm font-semibold text-adab-navy-800 hover:border-adab-navy-800 disabled:opacity-50"
                >
                  {actingId === item.id ? "Working…" : "Reject"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
