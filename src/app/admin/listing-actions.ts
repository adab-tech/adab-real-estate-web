"use server";

import { revalidatePath } from "next/cache";
import { sendListingApprovedEmail } from "@/lib/email/listing-approved";
import { revalidatePropertyPages } from "@/lib/admin/revalidate";
import { requireAdminMutationClient } from "@/lib/supabase/admin-mutations";

export type ReviewListingResult = {
  error?: string;
  success?: string;
  emailSent?: boolean;
};

export async function approveListing(id: string): Promise<ReviewListingResult> {
  const { supabase, user } = await requireAdminMutationClient();

  const property = await supabase
    .from("properties")
    .select(
      "id, slug, title, status, price_ngn, owner_id, profiles!owner_id(full_name, email)",
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
    .update({ status: "published", reviewed_by: user.id })
    .eq("id", id)
    .eq("status", "pending_review")
    .select("id, status")
    .maybeSingle();

  if (update.error) {
    return { error: update.error.message };
  }

  if (!update.data || update.data.status !== "published") {
    return {
      error:
        "Approval did not persist. Run supabase/fix-admin-approve-actions.sql in Supabase, then sign out and back in.",
    };
  }

  if (property.data.slug) {
    revalidatePropertyPages(property.data.slug);
  }

  revalidatePath("/admin/listings/pending");
  revalidatePath("/admin/properties");
  revalidatePath("/portal/admin");

  const ownerEmail = owner?.email?.trim();
  let emailSent = false;

  if (ownerEmail && property.data.slug) {
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
  const { supabase, user } = await requireAdminMutationClient();

  const result = await supabase
    .from("properties")
    .update({
      status: "rejected",
      rejection_reason: reason || "Listing needs changes before approval.",
      reviewed_by: user.id,
    })
    .eq("id", id)
    .eq("status", "pending_review")
    .select("id, status")
    .maybeSingle();

  if (result.error) {
    return { error: result.error.message };
  }

  if (!result.data || result.data.status !== "rejected") {
    return {
      error:
        "Rejection did not persist. Run supabase/fix-admin-approve-actions.sql in Supabase, then sign out and back in.",
    };
  }

  revalidatePath("/admin/listings/pending");
  revalidatePath("/admin/properties");
  revalidatePath("/portal/admin");

  return {
    success: "Listing rejected. The lister can revise and resubmit.",
  };
}

/** Aliases used by PendingListingsPanel */
export const approveListingAdmin = approveListing;
export const rejectListingAdmin = rejectListing;
