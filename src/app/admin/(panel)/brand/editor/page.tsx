import { BrandTemplateEditor } from "@/components/admin/brand/BrandTemplateEditor";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { fetchPropertiesFromSupabase } from "@/lib/supabase/properties";
import type { BrandTemplateDraft } from "@/lib/brand/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brand Template Editor",
  robots: { index: false, follow: false },
};

export default async function BrandEditorPage() {
  const { supabase, user } = await requireAdmin();

  const { data: draftRows } = await supabase
    .from("brand_template_drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const drafts = (draftRows ?? []) as BrandTemplateDraft[];
  const properties = (await fetchPropertiesFromSupabase()) ?? [];

  return (
    <BrandTemplateEditor initialDrafts={drafts} properties={properties} />
  );
}
