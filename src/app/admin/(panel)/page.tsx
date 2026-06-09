import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { POST_STATUS_LABELS } from "@/types/post";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: propertyCount },
    { count: availableCount },
    { count: inquiryCount },
    { count: postCount },
    { count: publishedPostCount },
    { count: draftPostCount },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),
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
  ]);

  const cards = [
    {
      title: "Properties",
      value: propertyCount ?? 0,
      detail: `${availableCount ?? 0} available`,
      href: "/admin/properties",
      cta: "Manage listings",
    },
    {
      title: "Inquiries",
      value: inquiryCount ?? 0,
      detail: "Leads from contact forms",
      href: "/admin/inquiries",
      cta: "View inquiries",
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
          Overview of your site content and leads
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
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

      <div className="flex flex-wrap gap-3">
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
