import type { BrandTemplateData } from "@/lib/brand/types";
import { siteConfig } from "@/lib/site-config";

export function buildWhatsAppShareUrl(data: BrandTemplateData): string {
  const text = [
    data.title,
    data.price,
    data.location,
    data.ctaLink || siteConfig.website,
    "— Adab Real Estate Agency",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildLinkedInShareUrl(data: BrandTemplateData): string {
  const url = data.ctaLink || siteConfig.website;
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export const instagramShareInstructions = [
  "Download the PNG using the button above.",
  "Open Instagram → Create → Post or Story.",
  "Select the downloaded image from your gallery.",
  "Add location/tags if needed, then publish.",
];

export const whatsappStatusInstructions = [
  "Download the PNG first (WhatsApp Status needs an image file).",
  "Open WhatsApp → Status → Add photo.",
  "Pick the downloaded graphic from your phone.",
  "Optional: use “Share via WhatsApp” to send the listing text to a contact.",
];

export const linkedInShareInstructions = [
  "Download the PNG for a visual post, or use “Share on LinkedIn” for a link post.",
  "On LinkedIn: Start a post → Add photo → select your PNG.",
  "Paste your listing URL in the post body for click-through.",
];

export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    return false;
  }
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFilename(templateType: string, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `adab-${templateType}-${slug || "export"}.png`;
}
