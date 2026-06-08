"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveListing,
  rejectListing,
} from "@/app/portal/admin/actions";
import { formatNaira } from "@/lib/portal/format";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type PendingListing = {
  id: string;
  title: string;
  description: string;
  price_ngn: number;
  images: string[];
  location: {
    area?: string;
    city?: string;
    state?: string;
  };
  profiles: {
    full_name?: string;
    email?: string;
    lister_type?: string;
  } | null;
};

export function AdminQueue() {
  const [listings, setListings] = useState<PendingListing[] | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    const session = await client.auth.getSession();
    if (!session.data.session) {
      window.location.href = "/portal/login";
      return;
    }

    const profile = await client
      .from("profiles")
      .select("role")
      .eq("id", session.data.session.user.id)
      .single();

    if (profile.error || profile.data.role !== "admin") {
      window.location.href = "/portal/dashboard";
      return;
    }

    const result = await client
      .from("properties")
      .select(
        "id, slug, title, type, status, price_ngn, location, images, description, created_at, owner_id, profiles(full_name, email, lister_type)",
      )
      .eq("status", "pending_review")
      .order("created_at", { ascending: true });

    if (result.error) {
      setError(result.error.message);
      setListings([]);
      return;
    }

    setListings((result.data as PendingListing[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function reviewListing(id: string, action: "approve" | "reject") {
    if (action === "reject") {
      const input = window.prompt(
        "Reason for rejection (shown to lister):",
        "Please update photos and property details.",
      );
      if (input === null) return;

      const result = await rejectListing(id, input);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }

      setMessage({
        type: "success",
        text: result.success ?? "Listing rejected.",
      });
      load();
      return;
    }

    const result = await approveListing(id);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    const emailNote =
      result.emailSent === false
        ? " (confirmation email logged — configure RESEND_API_KEY to send.)"
        : result.emailSent
          ? " Confirmation email sent to the lister."
          : "";

    setMessage({
      type: "success",
      text: `${result.success ?? "Listing approved."}${emailNote}`,
    });
    load();
  }

  if (listings === null) {
    return <p className="text-sm text-adab-gray-500">Loading queue…</p>;
  }

  return (
    <>
      {message && (
        <div
          className={`portal-alert portal-alert-${message.type === "success" ? "success" : "error"} mt-6`}
        >
          {message.text}
        </div>
      )}
      {error && (
        <div className="portal-alert portal-alert-error mt-6">{error}</div>
      )}

      {!listings.length ? (
        <p className="text-sm text-adab-gray-500">
          No listings awaiting approval.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {listings.map((item) => {
            const owner = item.profiles ?? {};
            const place = [
              item.location?.area,
              item.location?.city,
              item.location?.state,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article className="portal-admin-card" key={item.id}>
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt=""
                    className="portal-admin-thumb"
                  />
                ) : (
                  <div className="portal-admin-thumb portal-admin-thumb-empty">
                    No image
                  </div>
                )}
                <div className="portal-admin-card-body">
                  <h3 className="font-semibold text-adab-navy-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-adab-gray-500">
                    {place} · {formatNaira(item.price_ngn)}
                  </p>
                  <p className="mt-1 text-xs text-adab-gray-500">
                    Submitted by {owner.full_name || owner.email || "Unknown"}
                    {owner.lister_type ? ` (${owner.lister_type})` : ""}
                  </p>
                  <p className="mt-3 text-sm text-adab-navy-700">
                    {item.description.slice(0, 180)}
                    {item.description.length > 180 ? "…" : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="portal-btn portal-btn-primary"
                      onClick={() => reviewListing(item.id, "approve")}
                    >
                      Approve & publish
                    </button>
                    <button
                      type="button"
                      className="portal-btn portal-btn-ghost"
                      onClick={() => reviewListing(item.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
