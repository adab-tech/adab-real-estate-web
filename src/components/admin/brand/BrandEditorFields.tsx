import type { BrandTemplateData } from "@/lib/brand/types";
import { BrandPhotoUpload } from "@/components/admin/brand/BrandPhotoUpload";

type ListingOption = {
  slug: string;
  title: string;
  image?: string;
};

type BrandEditorFieldsProps = {
  data: BrandTemplateData;
  onChange: (patch: Partial<BrandTemplateData>) => void;
  listings: ListingOption[];
  onLoadListing: (slug: string) => void;
  showPropertyFields?: boolean;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
}) {
  const className =
    "mt-1 w-full rounded-lg border border-adab-gray-300 px-3 py-2 text-sm text-adab-navy-800";

  return (
    <label className="block text-xs font-semibold text-adab-navy-800">
      {label}
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

export function BrandEditorFields({
  data,
  onChange,
  listings,
  onLoadListing,
  showPropertyFields = true,
}: BrandEditorFieldsProps) {
  return (
    <div className="space-y-4">
      {listings.length > 0 && (
        <label className="block text-xs font-semibold text-adab-navy-800">
          Load from listing
          <select
            className="mt-1 w-full rounded-lg border border-adab-gray-300 px-3 py-2 text-sm text-adab-navy-800"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) onLoadListing(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Select a published property…</option>
            {listings.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <BrandPhotoUpload
        photoUrl={data.photoUrl}
        onPhotoChange={(url) => onChange({ photoUrl: url })}
      />

      {showPropertyFields && (
        <>
          <Field
            label="Badge (For Sale / For Rent)"
            value={data.badge}
            onChange={(badge) => onChange({ badge })}
          />
          <Field
            label="Title"
            value={data.title}
            onChange={(title) => onChange({ title })}
          />
          <Field
            label="Subtitle"
            value={data.subtitle}
            onChange={(subtitle) => onChange({ subtitle })}
          />
          <Field
            label="Price (NGN)"
            value={data.price}
            onChange={(price) => onChange({ price })}
          />
          <Field
            label="Location"
            value={data.location}
            onChange={(location) => onChange({ location })}
          />
          <Field
            label="Description"
            value={data.description}
            onChange={(description) => onChange({ description })}
            rows={3}
          />
          <div className="grid grid-cols-3 gap-2">
            <Field
              label="Beds"
              value={data.bedrooms}
              onChange={(bedrooms) => onChange({ bedrooms })}
            />
            <Field
              label="Baths"
              value={data.bathrooms}
              onChange={(bathrooms) => onChange({ bathrooms })}
            />
            <Field
              label="sqm"
              value={data.sqm}
              onChange={(sqm) => onChange({ sqm })}
            />
          </div>
        </>
      )}

      <hr className="border-adab-gray-300/60" />

      <Field
        label="Agent name"
        value={data.agentName}
        onChange={(agentName) => onChange({ agentName })}
      />
      <Field
        label="Agent title"
        value={data.agentTitle}
        onChange={(agentTitle) => onChange({ agentTitle })}
      />
      <Field
        label="Phone"
        value={data.agentPhone}
        onChange={(agentPhone) => onChange({ agentPhone })}
      />
      <Field
        label="Email"
        value={data.agentEmail}
        onChange={(agentEmail) => onChange({ agentEmail })}
        type="email"
      />
      <Field
        label="CTA link (listing / adab.ng / wa.me)"
        value={data.ctaLink}
        onChange={(ctaLink) => onChange({ ctaLink })}
        type="url"
      />
      <Field
        label="CTA label"
        value={data.ctaLabel}
        onChange={(ctaLabel) => onChange({ ctaLabel })}
      />
      <Field
        label="WhatsApp link"
        value={data.whatsappLink}
        onChange={(whatsappLink) => onChange({ whatsappLink })}
        type="url"
      />
    </div>
  );
}
