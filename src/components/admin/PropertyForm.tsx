"use client";

import { useState } from "react";
import {
  createPropertyAction,
  deletePropertyAction,
  retirePropertyAction,
  updatePropertyAction,
} from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  formatFeatures,
  formatImages,
  parseImages,
  slugifyTitle,
} from "@/lib/admin/property-form";
import type { Property } from "@/types/property";

type PropertyFormProps = {
  property?: Property;
  mode: "create" | "edit";
};

const inputClass =
  "w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm outline-none focus:border-adab-gold-500";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-adab-gray-500";

function defaultId() {
  return `prop-${Date.now().toString(36)}`;
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const [propertyId] = useState(() => property?.id ?? defaultId());
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(property?.slug));
  const [images, setImages] = useState(
    property ? formatImages(property.images) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  }

  function appendImage(url: string) {
    setImages((current) => (current ? `${current}\n${url}` : url));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const action =
      mode === "create"
        ? createPropertyAction
        : (data: FormData) =>
            updatePropertyAction(property!.id, property!.slug, data);

    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!property) return;
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;

    setPending(true);
    const result = await deletePropertyAction(property.id, property.slug);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  const imageList = parseImages(images);

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <input type="hidden" name="id" value={propertyId} />

      <section className="grid gap-4 tablet:grid-cols-2">
        <Field label="Title" name="title">
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="URL slug" name="slug">
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </Field>

        <div className="tablet:col-span-2">
          <Field label="Description" name="description">
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={property?.description}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 tablet:grid-cols-3">
        <Field label="Listing type" name="type">
          <select
            id="type"
            name="type"
            defaultValue={property?.type ?? "sale"}
            className={inputClass}
          >
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </Field>

        <Field label="Category" name="category">
          <select
            id="category"
            name="category"
            defaultValue={property?.category ?? "apartment"}
            className={inputClass}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="duplex">Duplex</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </Field>

        <Field label="Status" name="status">
          <select
            id="status"
            name="status"
            defaultValue={property?.status ?? "available"}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="under_offer">Under offer</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </Field>

        <Field label="Price (NGN)" name="priceNGN">
          <input
            id="priceNGN"
            name="priceNGN"
            type="number"
            min={0}
            required
            defaultValue={property?.priceNGN}
            className={inputClass}
          />
        </Field>

        <Field label="Rent period" name="pricePeriod">
          <select
            id="pricePeriod"
            name="pricePeriod"
            defaultValue={property?.pricePeriod ?? ""}
            className={inputClass}
          >
            <option value="">Default</option>
            <option value="year">Per year</option>
            <option value="month">Per month</option>
            <option value="negotiable">Negotiable (land / plot)</option>
          </select>
        </Field>

        <Field label="Published date" name="publishedAt">
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            required
            defaultValue={
              property?.publishedAt ?? new Date().toISOString().slice(0, 10)
            }
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm font-semibold text-adab-navy-800">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured}
            className="h-4 w-4 rounded border-adab-gray-300"
          />
          Featured on homepage
        </label>
      </section>

      <section className="grid gap-4 tablet:grid-cols-2">
        <Field label="City" name="city">
          <input
            id="city"
            name="city"
            required
            defaultValue={property?.location.city}
            className={inputClass}
          />
        </Field>
        <Field label="Area" name="area">
          <input
            id="area"
            name="area"
            required
            defaultValue={property?.location.area}
            className={inputClass}
          />
        </Field>
        <Field label="State" name="state">
          <input
            id="state"
            name="state"
            required
            defaultValue={property?.location.state}
            className={inputClass}
          />
        </Field>
        <Field label="Address (optional)" name="address">
          <input
            id="address"
            name="address"
            defaultValue={property?.location.address}
            className={inputClass}
          />
        </Field>
        <Field label="Latitude" name="lat">
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            required
            defaultValue={property?.location.lat ?? 9.0765}
            className={inputClass}
          />
        </Field>
        <Field label="Longitude" name="lng">
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            required
            defaultValue={property?.location.lng ?? 7.3986}
            className={inputClass}
          />
        </Field>
        <Field label="Bedrooms" name="beds">
          <input
            id="beds"
            name="beds"
            type="number"
            min={0}
            defaultValue={property?.beds ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Bathrooms" name="baths">
          <input
            id="baths"
            name="baths"
            type="number"
            min={0}
            defaultValue={property?.baths ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Size (sqm)" name="sqm">
          <input
            id="sqm"
            name="sqm"
            type="number"
            min={0}
            defaultValue={property?.sqm ?? ""}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <Field label="Features (one per line)" name="features">
          <textarea
            id="features"
            name="features"
            rows={4}
            defaultValue={property ? formatFeatures(property.features) : ""}
            className={inputClass}
            placeholder={"24/7 security\nFitted kitchen\nSwimming pool"}
          />
        </Field>

        <ImageUpload slug={slug} onUploaded={appendImage} />

        <Field label="Image URLs (one per line)" name="images">
          <textarea
            id="images"
            name="images"
            required
            rows={4}
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className={inputClass}
          />
        </Field>

        {imageList.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageList.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="h-20 w-28 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-adab-gray-300 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-adab-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-adab-navy-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create listing" : "Save changes"}
        </button>

        {mode === "edit" && property && (
          <>
            <button
              type="button"
              onClick={async () => {
                if (
                  !confirm(
                    `Retire "${property.title}"? It will be marked ${property.type === "rent" ? "rented" : "sold"} and unfeatured.`,
                  )
                ) {
                  return;
                }
                setPending(true);
                const result = await retirePropertyAction(
                  property.id,
                  property.slug,
                  property.type,
                );
                if (result?.error) {
                  setError(result.error);
                  setPending(false);
                } else {
                  window.location.reload();
                }
              }}
              disabled={pending}
              className="rounded-full border border-adab-gray-300 px-6 py-2.5 text-sm font-semibold text-adab-navy-800 hover:bg-white disabled:opacity-60"
            >
              Retire listing
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Delete listing
            </button>
          </>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  children: React.ReactNode;
};

function Field({ label, name, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
