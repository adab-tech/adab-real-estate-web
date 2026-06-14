"use client";

type CsvColumn<T extends Record<string, unknown>> = {
  key: keyof T & string;
  label: string;
};

type CsvExportButtonProps<T extends Record<string, unknown>> = {
  filename: string;
  rows: T[];
  columns: CsvColumn<T>[];
  label?: string;
};

function escapeCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function CsvExportButton<T extends Record<string, unknown>>({
  filename,
  rows,
  columns,
  label = "Export CSV",
}: CsvExportButtonProps<T>) {
  function handleExport() {
    const header = columns.map((column) => escapeCsvCell(column.label)).join(",");
    const body = rows
      .map((row) =>
        columns.map((column) => escapeCsvCell(row[column.key])).join(","),
      )
      .join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-full border border-adab-navy-800/15 bg-white px-4 py-2 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500 hover:bg-adab-gold-500/10"
    >
      {label}
    </button>
  );
}
