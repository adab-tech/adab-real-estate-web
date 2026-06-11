import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { POST_STATUS_LABELS } from "@/types/post";

type PendingListing = {
  id: string;
  title: string;
  slug: string;
  location: { area?: string; city?: string; state?: string };
};

function isKanoLocation(location: PendingListing["location"]): boolean {
  const state = String(location?.state ?? "").toLowerCase();
  const city = String(location?.city ?? "").toLowerCase();
  return state.includes("kano") || city.includes("kano");
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    { count: propertyCount },
    { count: availableCount },
    { count: pendingListingCount },
    { count: openApplicationCount },
    { count: recentInquiryCount },
    { count: inquiryCount },
    { count: postCount },
    { count: publishedPostCount },
    { count: draftPostCount },
    { data: pendingListings },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review"),
    supabase
      .from("pm_applications")
      .select("*", { count: "exact", head: true })
      .in("status", ["submitted", "reviewing"]),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("properties")
      .select("id, title, slug, location")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const kanoPending = ((pendingListings ?? []) as PendingListing[]).filter(
    (item) => isKanoLocation(item.location),
  );

  const actionCards = [
    {
      title: "Pending listings",
      value: pendingListingCount ?? 0,
      detail: "Awaiting admin review",
      href: "/admin/listings/pending",
      cta: "Review queue",
      highlight: (pendingListingCount ?? 0) > 0,
    },
    {
      title: "Open applications",
      value: openApplicationCount ?? 0,
      detail: "Submitted or in review",
      href: "/admin/pm/applications",
      cta: "Manage applications",
      highlight: (openApplicationCount ?? 0) > 0,
    },
    {
      title: "Recent inquiries",
      value: recentInquiryCount ?? 0,
      detail: `Last 7 days · ${inquiryCount ?? 0} total`,
      href: "/admin/inquiries",
      cta: "View inquiries",
      highlight: (recentInquiryCount ?? 0) > 0,
    },
  ];

  const contentCards = [
    {
      title: "Properties",
      value: propertyCount ?? 0,
      detail: `${availableCount ?? 0} available`,
      href: "/admin/properties",
      cta: "Manage listings",
    },
    {
      title: "Posts",
      value: postCount ?? 0,
      detail: `${publishedPostCount ?? 0} published · ${draftPostCount ?? 0} ${POST_STATUS_LABELS.draft.toLowerCase()}`,
      href: "/admin/posts",
      cta: "Manage posts",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Action items and site overview
        </p>
      </div>

      {kanoPending.length > 0 ? (
        <div
          className="rounded-2xl border border-amber-300 bg-amber-50 p-5"
          role="alert"
        >
          <p className="font-semibold text-amber-900">
            Kano listing{kanoPending.length === 1 ? "" : "s"} awaiting review
          </p>
          <p className="mt-1 text-sm text-amber-800">
            {kanoPending.length} pending listing
            {kanoPending.length === 1 ? "" : "s"} in Kano need approval before
            going live on the site.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-amber-900">
            {kanoPending.slice(0, 3).map((item) => (
              <li key={item.id}>
                <Link
                  href="/admin/listings/pending"
                  className="font-medium underline hover:text-amber-700"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          {kanoPending.length > 3 ? (
            <p className="mt-2 text-xs text-amber-700">
              +{kanoPending.length - 3} more in the pending queue
            </p>
          ) : null}
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-adab-gray-500">
          Needs attention
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actionCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`rounded-2xl border bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(27,42,74,0.12)] ${
                card.highlight
                  ? "border-adab-gold-400 ring-1 ring-adab-gold-200"
                  : "border-adab-gray-300"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-adab-gray-500">
                {card.title}
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-adab-navy-800">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-adab-gray-500">{card.detail}</p>
              <p className="mt-4 text-sm font-semibold text-adab-gold-500">
                {card.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-adab-gray-500">
          Content
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contentCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(27,42,74,0.12)]"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-adab-gray-500">
                {card.title}
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-adab-navy-800">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-adab-gray-500">{card.detail}</p>
              <p className="mt-4 text-sm font-semibold text-adab-gold-500">
                {card.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/listings/pending"
          className="rounded-full border border-adab-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-adab-cream"
        >
          Pending listings
        </Link>
        <Link
          href="/admin/pm/applications"
          className="rounded-full border border-adab-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-adab-cream"
        >
          Applications
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-full border border-adab-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-adab-cream"
        >
          Settings
        </Link>
        <Link
          href="/admin/properties/new"
          className="rounded-full bg-adab-gold-500 px-5 py-2.5 text-sm font-semibold text-adab-navy-900 hover:bg-adab-gold-400"
        >
          + Add property
        </Link>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-adab-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700"
        >
          + New post
        </Link>
      </div>
    </div>
  );
}
