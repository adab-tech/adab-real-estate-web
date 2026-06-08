import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";
import type { Property } from "@/types/property";

export async function fetchPropertiesFromSupabase(): Promise<Property[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("status", ["published", "available"])
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase properties fetch failed:", error.message);
    return null;
  }

  if (!data?.length) return null;

  return (data as PropertyRow[]).map(mapPropertyRow);
}

export async function fetchPropertyBySlugFromSupabase(
  slug: string,
): Promise<Property | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .in("status", ["published", "available"])
    .maybeSingle();

  if (error) {
    console.error("Supabase property fetch failed:", error.message);
    return null;
  }

  if (!data) return null;

  return mapPropertyRow(data as PropertyRow);
}
