"use server";

import { sendListingApprovedEmail } from "@/lib/email/listing-approved";
import { requirePortalAdmin } from "@/lib/portal/profile";

export type ReviewListingResult = {
  error?: string;
  success?: string;
  emailSent?: boolean;
};

export async function approveListing(id: string): Promise<ReviewListingResult> {
  const session = await requirePortalAdmin();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const { supabase } = session;

  const property = await supabase
    .from("properties")
    .select(
      "id, slug, title, status, owner_id, profiles!owner_id(full_name, email)",
    )
    .eq("id", id)
    .eq("status", "pending_review")
    .single();

  if (property.error || !property.data) {
    return {
      error: property.error?.message ?? "Listing not found or already reviewed.",
    };
  }

  const owner = property.data.profiles as {
    full_name?: string | null;
    email?: string | null;
  } | null;

  const update = await supabase
    .from("properties")
    .update({ status: "published" })
    .eq("id", id)
    .select("id, status")
    .single();

  if (update.error) {
    return { error: update.error.message };
  }

  const ownerEmail = owner?.email?.trim();
  let emailSent = false;

  if (ownerEmail && property.data.slug) {
    // Await email send before returning — admin UI reflects delivery status.
    const emailResult = await sendListingApprovedEmail({
      to: ownerEmail,
      listerName: owner?.full_name?.trim() ?? "",
      propertyTitle: property.data.title,
      propertySlug: property.data.slug,
    });
    emailSent = emailResult.sent;

    if (emailResult.error) {
      console.error("[approveListing] Approval email failed to send.", {
        propertyId: id,
        ownerEmail,
        error: emailResult.error,
      });
    }
  } else if (!ownerEmail) {
    console.warn(
      "[approveListing] No lister email on profile — approval email skipped.",
      { propertyId: id, ownerId: property.data.owner_id },
    );
  }

  return {
    success: "Listing approved and published.",
    emailSent,
  };
}

export async function rejectListing(
  id: string,
  reason: string,
): Promise<ReviewListingResult> {
  const session = await requirePortalAdmin();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const { supabase } = session;

  const result = await supabase
    .from("properties")
    .update({
      status: "rejected",
      rejection_reason: reason || "Listing needs changes before approval.",
    })
    .eq("id", id)
    .eq("status", "pending_review")
    .select("id, status")
    .single();

  if (result.error) {
    return { error: result.error.message };
  }

  return {
    success: "Listing rejected. The lister can revise and resubmit.",
  };
}
