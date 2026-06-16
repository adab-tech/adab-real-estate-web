"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { saveBrandDraft } from "@/app/admin/brand-actions";
import { BrandEditorFields } from "@/components/admin/brand/BrandEditorFields";
import { BrandExportPanel } from "@/components/admin/brand/BrandExportPanel";
import { BrandTemplatePreview } from "@/components/admin/brand/BrandTemplatePreview";
import { SavedDraftsList } from "@/components/admin/brand/SavedDraftsList";
import { previewScale } from "@/lib/brand/export";
import {
  brandTemplateConfigs,
  getDefaultTemplateData,
  getTemplateConfig,
  templateDataFromProperty,
} from "@/lib/brand/templates";
import type {
  BrandTemplateData,
  BrandTemplateDraft,
  BrandTemplateType,
} from "@/lib/brand/types";
import type { Property } from "@/types/property";

type BrandTemplateEditorProps = {
  initialDrafts: BrandTemplateDraft[];
  properties: Property[];
};

export function BrandTemplateEditor({
  initialDrafts,
  properties,
}: BrandTemplateEditorProps) {
  const [templateType, setTemplateType] =
    useState<BrandTemplateType>("property-promo");
  const [data, setData] = useState<BrandTemplateData>(getDefaultTemplateData());
  const [draftName, setDraftName] = useState("");
  const [activeDraftId, setActiveDraftId] = useState<string | undefined>();
  const [drafts, setDrafts] = useState(initialDrafts);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  const config = getTemplateConfig(templateType);
  const scale = useMemo(() => {
    const w = previewWrapRef.current?.clientWidth ?? 360;
    return previewScale(w, config.width, 0.55);
  }, [config.width, templateType]);

  const listings = properties.map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.images[0],
  }));

  const propertyBySlug = useMemo(
    () => new Map(properties.map((p) => [p.slug, p])),
    [properties],
  );

  const patchData = useCallback((patch: Partial<BrandTemplateData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  function handleTemplateChange(type: BrandTemplateType) {
    setTemplateType(type);
    setActiveDraftId(undefined);
    setDraftName("");
  }

  function handleLoadListing(slug: string) {
    const property = propertyBySlug.get(slug);
    if (property) {
      setData(templateDataFromProperty(property));
      setDraftName(property.title.slice(0, 60));
    }
  }

  function handleLoadDraft(draft: BrandTemplateDraft) {
    setTemplateType(draft.template_type);
    setData(draft.payload);
    setDraftName(draft.name ?? "");
    setActiveDraftId(draft.id);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveBrandDraft({
        id: activeDraftId,
        templateType,
        name: draftName || data.title,
        payload: data,
      });
      if (result.ok) {
        setActiveDraftId(result.id);
        setSaveMessage("Draft saved");
        setDrafts((prev) => {
          const next = prev.filter((d) => d.id !== result.id);
          const row: BrandTemplateDraft = {
            id: result.id,
            user_id: "",
            template_type: templateType,
            name: draftName || data.title,
            payload: data,
            preview_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return [row, ...next];
        });
      } else {
        setSaveMessage(result.error);
      }
    });
  }

  const socialTemplates = brandTemplateConfigs.filter(
    (t) => t.category === "social",
  );
  const officeTemplates = brandTemplateConfigs.filter(
    (t) => t.category === "office",
  );

  const showPropertyFields = !["email-signature", "business-card", "letterhead", "linkedin-cover"].includes(
    templateType,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between">
        <div>
          <Link
            href="/admin/brand"
            className="text-sm font-medium text-adab-navy-800/70 hover:text-adab-gold-500"
          >
            ← Brand assets
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold text-adab-navy-800">
            Brand template editor
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-adab-gray-500">
            Customize Adab templates, upload photos, save drafts, and export PNGs
            for WhatsApp Status, Instagram, and LinkedIn.
          </p>
        </div>
      </div>

      <div className="grid gap-8 desktop:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-adab-gray-300/60 bg-white p-4">
            <h2 className="text-sm font-bold text-adab-navy-800">Templates</h2>
            <p className="mt-1 text-xs text-adab-gray-500">Social & promo</p>
            <ul className="mt-3 space-y-1">
              {socialTemplates.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange(t.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      templateType === t.id
                        ? "bg-adab-navy-800 font-semibold text-white"
                        : "text-adab-navy-800 hover:bg-adab-cream"
                    }`}
                  >
                    {t.name}
                    <span className="mt-0.5 block text-[10px] opacity-70">
                      {t.width}×{t.height}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-adab-gray-500">Office & print</p>
            <ul className="mt-2 space-y-1">
              {officeTemplates.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange(t.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      templateType === t.id
                        ? "bg-adab-navy-800 font-semibold text-white"
                        : "text-adab-navy-800 hover:bg-adab-cream"
                    }`}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-adab-gray-300/60 bg-white p-4">
            <h2 className="text-sm font-bold text-adab-navy-800">My saved templates</h2>
            <div className="mt-3">
              <SavedDraftsList
                drafts={drafts}
                activeId={activeDraftId}
                onLoad={handleLoadDraft}
                onDraftsChange={setDrafts}
              />
            </div>
          </section>
        </aside>

        <div className="grid gap-6 desktop:grid-cols-2">
          <section className="rounded-2xl border border-adab-gray-300/60 bg-white p-5">
            <h2 className="font-semibold text-adab-navy-800">Edit content</h2>
            <p className="mt-1 text-xs text-adab-gray-500">{config.description}</p>
            <div className="mt-4">
              <BrandEditorFields
                data={data}
                onChange={patchData}
                listings={listings}
                onLoadListing={handleLoadListing}
                showPropertyFields={showPropertyFields}
              />
            </div>
            <div className="mt-4 space-y-2 border-t border-adab-gray-300/60 pt-4">
              <label className="block text-xs font-semibold text-adab-navy-800">
                Draft name
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder={data.title}
                  className="mt-1 w-full rounded-lg border border-adab-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={pending}
                onClick={handleSave}
                className="w-full rounded-full bg-adab-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700 disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save draft"}
              </button>
              {saveMessage && (
                <p className="text-center text-xs text-adab-gray-600">{saveMessage}</p>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-adab-gray-300/60 bg-adab-cream/50 p-4">
              <h2 className="font-semibold text-adab-navy-800">Live preview</h2>
              <div
                ref={previewWrapRef}
                className="mt-4 overflow-auto rounded-xl bg-[#e8e6e1] p-4"
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: config.width * scale,
                    height: config.height * scale,
                  }}
                >
                  <BrandTemplatePreview
                    templateType={templateType}
                    data={data}
                    width={config.width}
                    height={config.height}
                    exportRef={canvasRef}
                  />
                </div>
              </div>
            </section>

            <BrandExportPanel
              templateType={templateType}
              data={data}
              canvasRef={canvasRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
