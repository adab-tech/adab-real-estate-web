"use client";

import { CsvExportButton } from "@/components/admin/CsvExportButton";

type InquiryExportRow = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  property_slug: string;
  created_at: string;
};

type InquiriesCsvExportProps = {
  rows: InquiryExportRow[];
};

export function InquiriesCsvExport({ rows }: InquiriesCsvExportProps) {
  return (
    <CsvExportButton
      filename="adab-inquiries.csv"
      rows={rows}
      columns={[
        { key: "created_at", label: "Date" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "source", label: "Source" },
        { key: "property_slug", label: "Property" },
        { key: "message", label: "Message" },
      ]}
    />
  );
}
