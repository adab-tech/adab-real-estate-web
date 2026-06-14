"use client";

import { CsvExportButton } from "@/components/admin/CsvExportButton";

type ApplicationExportRow = {
  full_name: string;
  email: string;
  phone: string;
  application_type: string;
  property_interest: string;
  status: string;
  created_at: string;
};

type ApplicationsCsvExportProps = {
  rows: ApplicationExportRow[];
};

export function ApplicationsCsvExport({ rows }: ApplicationsCsvExportProps) {
  return (
    <CsvExportButton
      filename="adab-applications.csv"
      rows={rows}
      columns={[
        { key: "created_at", label: "Submitted" },
        { key: "full_name", label: "Applicant" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "application_type", label: "Type" },
        { key: "property_interest", label: "Interest" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
