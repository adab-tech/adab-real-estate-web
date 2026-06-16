"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import type { BrandTemplateData, BrandTemplateType } from "@/lib/brand/types";

export async function saveBrandDraft(input: {
  id?: string;
  templateType: BrandTemplateType;
  name: string;
  payload: BrandTemplateData;
  previewUrl?: string;
}) {
  const { supabase, user } = await requireAdmin();

  const row = {
    user_id: user.id,
    template_type: input.templateType,
    name: input.name.trim() || "Untitled draft",
    payload: input.payload,
    preview_url: input.previewUrl ?? null,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("brand_template_drafts")
      .update(row)
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error) return { ok: false as const, error: error.message };
    revalidatePath("/admin/brand/editor");
    return { ok: true as const, id: data.id };
  }

  const { data, error } = await supabase
    .from("brand_template_drafts")
    .insert(row)
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/brand/editor");
  return { ok: true as const, id: data.id };
}

export async function deleteBrandDraft(id: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("brand_template_drafts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/brand/editor");
  return { ok: true as const };
}

export async function duplicateBrandDraft(id: string) {
  const { supabase, user } = await requireAdmin();

  const { data: source, error: fetchError } = await supabase
    .from("brand_template_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !source) {
    return { ok: false as const, error: fetchError?.message ?? "Not found" };
  }

  const { data, error } = await supabase
    .from("brand_template_drafts")
    .insert({
      user_id: user.id,
      template_type: source.template_type,
      name: `${source.name ?? "Draft"} (copy)`,
      payload: source.payload,
      preview_url: source.preview_url,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/brand/editor");
  return { ok: true as const, id: data.id };
}

export async function uploadBrandImage(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided" };
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const path = `${user.id}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("brand-assets")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    return { ok: false as const, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("brand-assets").getPublicUrl(path);

  return { ok: true as const, url: publicUrl };
}
