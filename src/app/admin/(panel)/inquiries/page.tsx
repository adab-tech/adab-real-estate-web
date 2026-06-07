import { requireAdmin } from "@/lib/supabase/auth-server";

type InquiryRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  property_slug: string | null;
  source: string;
  created_at: string;
};

export default async function AdminInquiriesPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <p className="text-red-600">Failed to load inquiries: {error.message}</p>
    );
  }

  const inquiries = (data ?? []) as InquiryRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Inquiries
        </h1>
        <p className="mt-1 text-sm text-adab-gray-500">
          Recent leads from the website contact forms
        </p>
      </div>

      {inquiries.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No inquiries yet.
        </p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-[0_4px_24px_rgba(27,42,74,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-adab-navy-800">
                    {inquiry.name}
                  </h2>
                  <p className="text-sm text-adab-gray-500">
                    {inquiry.phone}
                    {inquiry.email ? ` · ${inquiry.email}` : ""}
                  </p>
                </div>
                <time className="text-xs text-adab-gray-500">
                  {new Date(inquiry.created_at).toLocaleString("en-NG")}
                </time>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-adab-navy-800">
                {inquiry.message}
              </p>
              <p className="mt-2 text-xs text-adab-gray-500">
                Source: {inquiry.source}
                {inquiry.property_slug
                  ? ` · Property: ${inquiry.property_slug}`
                  : ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
