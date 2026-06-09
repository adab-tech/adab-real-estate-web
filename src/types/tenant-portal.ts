export type KycStatus = "pending" | "submitted" | "verified" | "rejected";

export type ApplicationType =
  | "rental"
  | "management_onboarding"
  | "land_purchase";

export type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "withdrawn"
  | "retired";

export type LeaseStatus =
  | "draft"
  | "pending_signature"
  | "active"
  | "expired"
  | "terminated"
  | "retired";

export type MaintenancePriority = "low" | "normal" | "urgent" | "emergency";

export type MaintenanceStatus =
  | "open"
  | "submitted"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "manual";

export type AgreementStatus =
  | "draft"
  | "active"
  | "paused"
  | "terminated"
  | "retired";

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  rental: "Rental application",
  management_onboarding: "Management onboarding",
  land_purchase: "Land purchase interest",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  retired: "Retired",
};

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  verified: "Verified",
  rejected: "Rejected",
};

export const MAINTENANCE_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  submitted: "Submitted",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  draft: "Draft",
  pending_signature: "Pending signature",
  active: "Active",
  expired: "Expired",
  terminated: "Terminated",
  retired: "Retired",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  manual: "Manual record",
};

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  terminated: "Terminated",
  retired: "Retired",
};
