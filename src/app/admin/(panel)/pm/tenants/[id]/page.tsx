import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { KYC_STATUS_LABELS, type KycStatus } from "@/types/tenant-portal";

type TenantDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PmTenantDetailPage({
  params,
}: TenantDetailPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("tenant_profiles")
    .select(
      "id, kyc_status, kyc_notes, verified_at, profiles!tenant_profiles_id_fkey(full_name, email, phone)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const kycStatus = data.kyc_status as KycStatus;
  const profileRaw = data.profiles;
  const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/pm/tenants"
        className="text-sm text-adab-gray-500 hover:text-adab-navy-800"
      >
        ← All tenants
      </Link>

      <div className="rounded-2xl border border-adab-gray-300 bg-white p-6 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
        <h2 className="font-display text-xl font-bold text-adab-navy-800">
          {profile?.full_name ?? "Tenant"}
        </h2>
        <p className="mt-1 text-sm text-adab-gray-500">{profile?.email}</p>
        {profile?.phone ? (
          <p className="text-sm text-adab-gray-500">{profile.phone}</p>
        ) : null}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-adab-gray-500">
              KYC status
            </dt>
            <dd className="mt-1 font-medium text-adab-navy-800">
              {KYC_STATUS_LABELS[kycStatus] ?? kycStatus}
            </dd>
          </div>
          {data.verified_at ? (
            <div>
              <dt className="text-xs font-semibold uppercase text-adab-gray-500">
                Verified at
              </dt>
              <dd className="mt-1 text-adab-navy-800">
                {new Date(data.verified_at).toLocaleString("en-NG")}
              </dd>
            </div>
          ) : null}
        </dl>

        {data.kyc_notes ? (
          <p className="mt-4 text-sm text-adab-navy-700">{data.kyc_notes}</p>
        ) : null}
      </div>
    </div>
  );
}
