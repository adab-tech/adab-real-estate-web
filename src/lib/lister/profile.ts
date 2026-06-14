import { cache } from "react";
import { mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Property } from "@/types/property";

export type PublicListerProfile = {
  id: string;
  fullName: string | null;
  companyName: string | null;
  listerType: string | null;
  publicUsername: string;
};

function displayName(profile: PublicListerProfile): string {
  return (
    profile.companyName?.trim() ||
    profile.fullName?.trim() ||
    profile.publicUsername
  );
}

export function getListerDisplayName(profile: PublicListerProfile): string {
  return displayName(profile);
}

export function listerTypeLabel(type: string | null): string {
  switch (type) {
    case "agency":
      return "Agency";
    case "landlord":
      return "Landlord";
    case "owner":
      return "Property owner";
    default:
      return "Lister";
  }
}

export const getPublicListerByUsername = cache(
  async (username: string): Promise<PublicListerProfile | null> => {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const normalized = username.trim().toLowerCase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, company_name, lister_type, public_username, role")
      .eq("public_username", normalized)
      .maybeSingle();

    if (error || !data?.public_username) return null;
    if (data.role !== "lister" && data.role !== "admin") return null;

    return {
      id: data.id,
      fullName: data.full_name,
      companyName: data.company_name,
      listerType: data.lister_type,
      publicUsername: data.public_username,
    };
  },
);

export const getListerPublishedProperties = cache(
  async (ownerId: string): Promise<Property[]> => {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", ownerId)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Lister properties fetch failed:", error.message);
      return [];
    }

    return ((data ?? []) as PropertyRow[]).map(mapPropertyRow);
  },
);
