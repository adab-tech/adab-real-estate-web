"use client";

import { useState } from "react";
import type { BrandTemplateData, BrandTemplateType } from "@/lib/brand/types";
import { getTemplateConfig } from "@/lib/brand/templates";
import { exportCanvasToPng } from "@/lib/brand/export";
import { openPrintableHtml } from "@/lib/brand/print-html";
import {
  buildLinkedInShareUrl,
  buildWhatsAppShareUrl,
  copyImageToClipboard,
  downloadBlob,
  exportFilename,
  instagramShareInstructions,
  linkedInShareInstructions,
  whatsappStatusInstructions,
} from "@/lib/brand/share";

type BrandExportPanelProps = {
  templateType: BrandTemplateType;
  data: BrandTemplateData;
  canvasRef: React.RefObject<HTMLDivElement | null>;
};

export function BrandExportPanel({
  templateType,
  data,
  canvasRef,
}: BrandExportPanelProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const config = getTemplateConfig(templateType);

  async function getBlob(): Promise<Blob | null> {
    const el = canvasRef.current;
    if (!el) {
      setStatus("Preview not ready");
      return null;
    }
    setBusy(true);
    try {
      return await exportCanvasToPng(el, templateType);
    } catch {
      setStatus("Export failed — try Open printable HTML");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    const blob = await getBlob();
    if (!blob) return;
    downloadBlob(blob, exportFilename(templateType, data.title));
    setStatus("PNG downloaded");
  }

  async function handleCopy() {
    const blob = await getBlob();
    if (!blob) return;
    const ok = await copyImageToClipboard(blob);
    setStatus(ok ? "Copied to clipboard" : "Copy not supported — download PNG instead");
  }

  function handlePrintable() {
    openPrintableHtml(templateType, data);
  }

  const btn =
    "rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-adab-gold-500 text-adab-navy-900 hover:bg-adab-gold-400`;
  const secondary = `${btn} border border-adab-navy-800/20 bg-white text-adab-navy-800 hover:border-adab-gold-500`;

  return (
    <div className="space-y-4 rounded-2xl border border-adab-gray-300/60 bg-white p-5">
      <h3 className="font-semibold text-adab-navy-800">Export & share</h3>
      <p className="text-xs text-adab-gray-500">
        {config.width}×{config.height}px · Nigerian ₦ pricing · WhatsApp-first workflow
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={primary} disabled={busy} onClick={handleDownload}>
          Download PNG
        </button>
        <button type="button" className={secondary} disabled={busy} onClick={handleCopy}>
          Copy image
        </button>
        <button type="button" className={secondary} onClick={handlePrintable}>
          Open printable HTML
        </button>
        {config.staticHtml && (
          <a
            href={config.staticHtml}
            target="_blank"
            rel="noopener noreferrer"
            className={secondary}
          >
            Static template
          </a>
        )}
      </div>

      {config.sharePlatforms.includes("whatsapp") && (
        <div className="rounded-xl bg-[#25D366]/10 p-4">
          <p className="text-sm font-semibold text-adab-navy-800">WhatsApp</p>
          <ul className="mt-2 list-inside list-disc text-xs text-adab-gray-600">
            {whatsappStatusInstructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a
            href={buildWhatsAppShareUrl(data)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primary} mt-3 inline-flex`}
          >
            Share text via WhatsApp
          </a>
        </div>
      )}

      {config.sharePlatforms.includes("instagram") && (
        <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
          <p className="text-sm font-semibold text-adab-navy-800">Instagram</p>
          <ul className="mt-2 list-inside list-disc text-xs text-adab-gray-600">
            {instagramShareInstructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {config.sharePlatforms.includes("linkedin") && (
        <div className="rounded-xl bg-blue-600/10 p-4">
          <p className="text-sm font-semibold text-adab-navy-800">LinkedIn</p>
          <ul className="mt-2 list-inside list-disc text-xs text-adab-gray-600">
            {linkedInShareInstructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a
            href={buildLinkedInShareUrl(data)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${secondary} mt-3 inline-flex`}
          >
            Share on LinkedIn
          </a>
        </div>
      )}

      {status && <p className="text-sm text-adab-navy-700">{status}</p>}
    </div>
  );
}
