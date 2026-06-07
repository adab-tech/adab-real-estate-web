"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseFeatures,
  parseImages,
  propertyFormSchema,
} from "@/lib/admin/property-form";
import { revalidatePropertyPages } from "@/lib/admin/revalidate";
import { mapPropertyToRow } from "@/lib/supabase/mappers";
import {
  createSupabaseAuthClient,
  requireAdmin,
} from "@/lib/supabase/auth-server";
import type { Property } from "@/types/property";

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "featured") {
      obj[key] = true;
      continue;
    }
    obj[key] = value;
  }
  if (!("featured" in obj)) obj.featured = false;
  return obj;
}

function toProperty(values: ReturnType<typeof propertyFormSchema.parse>): Property {
  return {
    id: values.id,
    slug: values.slug,
    title: values.title,
    description: values.description,
    type: values.type,
    category: values.category,
    priceNGN: values.priceNGN,
    pricePeriod:
      values.type === "rent" && values.pricePeriod
        ? (values.pricePeriod as "year" | "month")
        : undefined,
    location: {
      city: values.city,
      area: values.area,
      state: values.state,
      address: values.address || undefined,
      lat: values.lat,
      lng: values.lng,
    },
    beds: values.beds === "" ? undefined : Number(values.beds),
    baths: values.baths === "" ? undefined : Number(values.baths),
    sqm: values.sqm === "" ? undefined : Number(values.sqm),
    features: parseFeatures(values.features),
    images: parseImages(values.images),
    status: values.status,
    featured: values.featured,
    publishedAt: values.publishedAt,
  };
}

export async function signOut() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createPropertyAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = propertyFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const property = toProperty(parsed.data);
  const row = mapPropertyToRow(property);

  const { error } = await supabase.from("properties").insert(row);
  if (error) return { error: error.message };

  revalidatePropertyPages(property.slug);
  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${property.id}/edit?saved=1`);
}

export async function updatePropertyAction(
  propertyId: string,
  oldSlug: string,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();
  const parsed = propertyFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  if (parsed.data.id !== propertyId) {
    return { error: "Property ID mismatch" };
  }

  const property = toProperty(parsed.data);
  const row = mapPropertyToRow(property);

  const { error } = await supabase
    .from("properties")
    .update(row)
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePropertyPages(property.slug, oldSlug);
  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${propertyId}/edit?saved=1`);
}

export async function deletePropertyAction(propertyId: string, slug: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePropertyPages(slug);
  revalidatePath("/admin/properties");
  redirect("/admin/properties?deleted=1");
}
