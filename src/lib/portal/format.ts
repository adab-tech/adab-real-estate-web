export function formatNaira(amount: number): string {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export function slugifyListing(title: string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)}-${Date.now().toString(36)}`;
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
