import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { PmStatusSelect } from "@/components/admin/PmStatusSelect";
import { updateTenantKycStatus } from "@/app/admin/pm-actions";
import { KYC_STATUS_LABELS, type KycStatus } from "@/types/tenant-portal";

type TenantRow = {
  id: string;
  kyc_status: KycStatus;
  profiles: { full_name: string | null; email: string; phone: string | null };
};

export default async function PmTenantsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("tenant_profiles")
    .select("id, kyc_status, profiles!id(full_name, email, phone)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-red-600">Failed to load tenants: {error.message}</p>
    );
  }

  const tenants = (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id as string,
      kyc_status: row.kyc_status as KycStatus,
      profiles: profile as TenantRow["profiles"],
    };
  });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-adab-navy-800">
        Tenants
      </h2>

      {tenants.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No tenant profiles yet. Tenants appear after registration.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">KYC</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="border-b border-adab-gray-300 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-adab-navy-800">
                      {tenant.profiles?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-adab-gray-500">
                      {tenant.profiles?.email}
                      {tenant.profiles?.phone
                        ? ` · ${tenant.profiles.phone}`
                        : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <PmStatusSelect
                      id={tenant.id}
                      current={tenant.kyc_status}
                      options={Object.entries(KYC_STATUS_LABELS).map(
                        ([value, label]) => ({ value, label }),
                      )}
                      action={updateTenantKycStatus}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pm/tenants/${tenant.id}`}
                      className="font-semibold text-adab-navy-800 hover:text-adab-gold-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
