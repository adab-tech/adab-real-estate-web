import { createZohoDeal, createZohoLead } from "@/lib/crm/zoho";
import { isZohoConfigured } from "@/lib/crm/config";

/** Fire-and-forget CRM sync — never blocks user flows on failure. */
export async function syncPropertyInquiryToCrm(input: {
  name: string;
  email?: string;
  phone: string;
  message: string;
  propertySlug?: string;
  source: string;
}): Promise<void> {
  if (!isZohoConfigured()) return;

  const result = await createZohoLead({
    fullName: input.name,
    email: input.email,
    phone: input.phone,
    source: input.source === "property_detail" ? "Property inquiry" : "Contact form",
    propertyInterest: input.propertySlug,
    description: input.message,
  });

  if (!result.ok) {
    console.error("[crm] property inquiry sync failed:", result.error);
  }
}

export async function syncTenantApplicationToCrm(input: {
  fullName: string;
  email: string;
  phone: string;
  applicationType: string;
  propertyInterest?: string | null;
  message?: string | null;
}): Promise<void> {
  if (!isZohoConfigured()) return;

  const description = [
    `Application type: ${input.applicationType}`,
    input.propertyInterest ? `Property interest: ${input.propertyInterest}` : null,
    input.message ? `Details: ${input.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await createZohoLead({
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    source: "Tenant application",
    propertyInterest: input.propertyInterest ?? undefined,
    description,
  });

  if (!result.ok) {
    console.error("[crm] tenant application sync failed:", result.error);
  }
}

export async function syncApprovedListingToCrm(input: {
  title: string;
  slug: string;
  priceNgn: number;
  listerEmail?: string | null;
  listerName?: string | null;
}): Promise<void> {
  if (!isZohoConfigured()) return;

  const description = [
    `Listing published on adab.ng`,
    `Slug: ${input.slug}`,
    input.listerName ? `Lister: ${input.listerName}` : null,
    input.listerEmail ? `Email: ${input.listerEmail}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await createZohoDeal({
    dealName: input.title,
    amountNgn: input.priceNgn,
    description,
    contactEmail: input.listerEmail ?? undefined,
  });

  if (!result.ok) {
    console.error("[crm] approved listing deal sync failed:", result.error);
  }
}
