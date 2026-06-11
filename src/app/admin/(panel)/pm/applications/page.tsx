import { requireAdmin } from "@/lib/supabase/auth-server";
import { PmApplicationActions } from "@/components/admin/PmApplicationActions";
import { PmStatusSelect } from "@/components/admin/PmStatusSelect";
import { updateApplicationStatus } from "@/app/admin/pm-actions";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_TYPE_LABELS,
  type ApplicationStatus,
  type ApplicationType,
} from "@/types/tenant-portal";

type ApplicationRow = {
  id: string;
  application_type: ApplicationType;
  full_name: string;
  email: string;
  phone: string;
  property_interest: string | null;
  status: ApplicationStatus;
  created_at: string;
};

export default async function PmApplicationsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("pm_applications")
    .select(
      "id, application_type, full_name, email, phone, property_interest, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-red-600">Failed to load applications: {error.message}</p>
    );
  }

  const applications = (data ?? []) as ApplicationRow[];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-adab-navy-800">
        Applications
      </h2>

      {applications.length === 0 ? (
        <p className="rounded-2xl border border-adab-gray-300 bg-white p-8 text-sm text-adab-gray-500">
          No applications yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-adab-gray-300 bg-adab-cream/80 text-xs uppercase tracking-wide text-adab-gray-500">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-adab-gray-300 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-adab-navy-800">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-adab-gray-500">
                      {app.email} · {app.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {APPLICATION_TYPE_LABELS[app.application_type]}
                  </td>
                  <td className="px-4 py-3 text-adab-gray-500">
                    {app.property_interest ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PmStatusSelect
                      id={app.id}
                      current={app.status}
                      options={Object.entries(APPLICATION_STATUS_LABELS).map(
                        ([value, label]) => ({ value, label }),
                      )}
                      action={updateApplicationStatus}
                    />
                    <PmApplicationActions id={app.id} status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-adab-gray-500">
                    {new Date(app.created_at).toLocaleDateString("en-NG")}
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
