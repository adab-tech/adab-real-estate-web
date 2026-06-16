"use client";

import html2canvas from "html2canvas";
import type { BrandTemplateType } from "@/lib/brand/types";
import { getTemplateConfig } from "@/lib/brand/templates";

export async function exportCanvasToPng(
  element: HTMLElement,
  templateType: BrandTemplateType,
): Promise<Blob> {
  const { width, height } = getTemplateConfig(templateType);

  const canvas = await html2canvas(element, {
    width,
    height,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create PNG"));
      },
      "image/png",
      1,
    );
  });
}

export function previewScale(
  containerWidth: number,
  templateWidth: number,
  maxScale = 1,
): number {
  const padding = 32;
  const available = containerWidth - padding;
  return Math.min(maxScale, available / templateWidth);
}
