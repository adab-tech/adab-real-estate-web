import { revalidatePath } from "next/cache";

export function revalidatePropertyPages(slug: string, oldSlug?: string) {
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);

  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/properties/${oldSlug}`);
  }
}

export function revalidatePostPages(slug: string, oldSlug?: string) {
  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath(`/updates/${slug}`);

  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/updates/${oldSlug}`);
  }
}
