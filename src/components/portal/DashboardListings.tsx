"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNaira, statusLabel } from "@/lib/portal/format";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ListingShareActions } from "@/components/share/ListingShareActions";

type Listing = {
  id: string;
  slug: string;
  title: string;
  type: string;
  status: string;
  price_ngn: number;
  location: {
    area?: string;
    city?: string;
    state?: string;
  };
  rejection_reason?: string | null;
};

export function DashboardListings() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const client = createSupabaseBrowserClient();
      const session = await client.auth.getSession();
      if (!session.data.session) {
        window.location.href = "/portal/login";
        return;
      }

      const userId = session.data.session.user.id;

      const result = await client
        .from("properties")
        .select(
          "id, slug, title, type, status, price_ngn, location, rejection_reason, created_at, updated_at",
        )
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });

      if (result.error) {
        setError(result.error.message);
        setListings([]);
        return;
      }

      setListings(result.data ?? []);
    }

    load();
  }, []);

  if (listings === null) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading listings">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="h-16 animate-pulse rounded-lg bg-adab-cream"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="portal-alert portal-alert-error">{error}</div>;
  }

  if (!listings.length) {
    return (
      <div className="py-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-adab-navy-800">
          No listings yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-adab-gray-500">
          List your first property on Adab.ng. Submitted listings are reviewed
          by our team before going live on the public site.
        </p>
        <Link
          href="/portal/listings/new"
          className="portal-btn portal-btn-primary mt-6 inline-flex"
        >
          + Add your first listing
        </Link>
      </div>
    );
  }

  return (
    <>
      {listings.map((item) => {
        const place = [item.location?.area, item.location?.city, item.location?.state]
          .filter(Boolean)
          .join(", ");

        return (
          <div
            className="portal-listing-row flex-col items-stretch gap-3"
            key={item.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-adab-navy-800">{item.title}</p>
                <p className="text-sm text-adab-gray-500">
                  {place} · {formatNaira(item.price_ngn)}
                </p>
                {item.rejection_reason && (
                  <p className="mt-1 text-xs text-red-700">
                    Rejected: {item.rejection_reason}
                  </p>
                )}
              </div>
              <span className={`portal-badge portal-badge-${item.status}`}>
                {statusLabel(item.status)}
              </span>
            </div>
            <ListingShareActions
              slug={item.slug}
              title={item.title}
              status={item.status}
              compact
            />
          </div>
        );
      })}
    </>
  );
}
