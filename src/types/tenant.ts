export type ApplicationType = "rental" | "land_purchase" | "lease";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "withdrawn";

export type MaintenancePriority = "low" | "normal" | "high" | "emergency";

export type MaintenanceStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "cancelled";

export type MaintenanceCategory =
  | "general"
  | "plumbing"
  | "electrical"
  | "hvac"
  | "structural"
  | "pest"
  | "other";

export type RentalApplicationData = {
  full_name: string;
  phone: string;
  email: string;
  current_address?: string;
  desired_move_in_date?: string;
  employment_status?: string;
  monthly_income_ngn?: number;
  employer?: string;
  references?: string;
  property_slug?: string;
  notes?: string;
};

export type MaintenanceRequestInput = {
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  photo_urls?: string[];
};
