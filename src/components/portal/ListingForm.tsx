"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
  NIGERIA_STATES,
} from "@/lib/portal/constants";
import { slugifyListing } from "@/lib/portal/format";
import { AddressAutocomplete } from "@/components/portal/AddressAutocomplete";
import { ensureListerProfile, requirePortalSession } from "@/lib/portal/ensure-profile";
import { formatSupabaseError } from "@/lib/portal/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ListingForm() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "sale",
    category: "apartment",
    price_ngn: "",
    price_period: "year",
    address: "",
    area: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    beds: "",
    baths: "",
    sqm: "",
    features: "",
    images: "",
    status: "pending_review",
  });

  useEffect(() => {
    async function checkAuth() {
      const client = createSupabaseBrowserClient();
      const session = await client.auth.getSession();
      if (!session.data.session) {
        router.replace("/portal/login");
      }
    }
    checkAuth();
  }, [router]);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function uploadImages(files: FileList, userId: string) {
    const client = createSupabaseBrowserClient();
    const fileArray = Array.from(files);

    if (fileArray.length > MAX_IMAGES) {
      throw new Error(`You can upload up to ${MAX_IMAGES} images.`);
    }

    const urls: string[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (!file.type.startsWith("image/")) {
        throw new Error(`${file.name} is not an image file.`);
      }
      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(`${file.name} exceeds the 5 MB limit.`);
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${userId}/${Date.now()}-${i}-${safeName}`;
      const upload = await client.storage
        .from("property-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (upload.error) {
        throw new Error(
          formatSupabaseError(
            upload.error,
            `Unable to upload ${file.name}. Check your connection and try again.`,
          ),
        );
      }

      const publicUrl = client.storage
        .from("property-images")
        .getPublicUrl(path);
      urls.push(publicUrl.data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSubmitting(true);
    setAlert(null);

    try {
      const client = createSupabaseBrowserClient();
      const session = await requirePortalSession(client);
      const user = session.user;
      await ensureListerProfile(client, user);

      const userId = user.id;
      const priceNgn = parseInt(form.price_ngn, 10);
      if (!Number.isFinite(priceNgn) || priceNgn < 0) {
        throw new Error("Enter a valid price in NGN.");
      }
      const fileInput = formEl.elements.namedItem(
        "image_files",
      ) as HTMLInputElement;

      let imageUrls: string[] = [];
      if (fileInput?.files?.length) {
        imageUrls = await uploadImages(fileInput.files, userId);
      }

      const extraUrls = form.images
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      imageUrls = imageUrls.concat(extraUrls);

      const status =
        form.status === "draft" ? "draft" : "pending_review";

      const payload = {
        id: crypto.randomUUID(),
        owner_id: userId,
        slug: slugifyListing(form.title),
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        category: form.category,
        price_ngn: priceNgn,
        price_period: form.type === "rent" ? form.price_period : null,
        location: {
          address: form.address.trim(),
          area: form.area.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
          ...(form.lat && form.lng
            ? {
                map_url: `https://www.google.com/maps/search/?api=1&query=${form.lat},${form.lng}`,
              }
            : {}),
        },
        beds: form.beds ? parseInt(form.beds, 10) : null,
        baths: form.baths ? parseInt(form.baths, 10) : null,
        sqm: form.sqm ? parseFloat(form.sqm) : null,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        images: imageUrls,
        status,
      };

      let result = await client
        .from("properties")
        .insert(payload)
        .select("id, slug, status")
        .single();

      if (result.error?.code === "23505") {
        payload.id = crypto.randomUUID();
        payload.slug = `${slugifyListing(form.title)}-${Date.now().toString(36)}`;
        result = await client
          .from("properties")
          .insert(payload)
          .select("id, slug, status")
          .single();
      }

      if (result.error) throw result.error;

      const message =
        result.data.status === "pending_review"
          ? "Listing submitted for Adab review. You will be notified once it is approved."
          : "Draft saved successfully.";

      setAlert({ type: "success", message });
      setTimeout(() => router.push("/portal/dashboard"), 1200);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "Your session expired. Please sign in again."
      ) {
        router.replace("/portal/login");
        setSubmitting(false);
        return;
      }

      setAlert({
        type: "error",
        message: formatSupabaseError(err, "Unable to save listing."),
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      {alert && (
        <div
          className={`portal-alert portal-alert-${alert.type === "success" ? "success" : "error"} mt-6`}
        >
          {alert.message}
        </div>
      )}

      <form
        className="portal-card mt-8 space-y-5 p-8"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="portal-label" htmlFor="title">
            Property title
          </label>
          <input
            className="portal-input"
            id="title"
            required
            placeholder="3-Bedroom Bungalow in Ibadan"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div>
          <label className="portal-label" htmlFor="description">
            Description
          </label>
          <textarea
            className="portal-textarea"
            id="description"
            rows={5}
            required
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="portal-label" htmlFor="type">
              Listing type
            </label>
            <select
              className="portal-select"
              id="type"
              required
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
            >
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </div>
          <div>
            <label className="portal-label" htmlFor="category">
              Category
            </label>
            <select
              className="portal-select"
              id="category"
              required
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="duplex">Duplex</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="portal-label" htmlFor="price_ngn">
              Price (NGN)
            </label>
            <input
              className="portal-input"
              id="price_ngn"
              type="number"
              min={0}
              required
              value={form.price_ngn}
              onChange={(e) => updateField("price_ngn", e.target.value)}
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="price_period">
              Rent period
            </label>
            <select
              className="portal-select"
              id="price_period"
              value={form.price_period}
              onChange={(e) => updateField("price_period", e.target.value)}
            >
              <option value="year">Per year</option>
              <option value="month">Per month</option>
            </select>
          </div>
        </div>

        <AddressAutocomplete
          id="address"
          label="Street address or landmark"
          required
          placeholder="Start typing any Nigerian address…"
          value={form.address}
          onValueChange={(value) => updateField("address", value)}
          onSelect={(parsed) =>
            setForm((prev) => ({
              ...prev,
              address: parsed.address,
              area: parsed.area || prev.area,
              city: parsed.city,
              state: parsed.state,
              lat: String(parsed.lat),
              lng: String(parsed.lng),
            }))
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="portal-label" htmlFor="area">
              Area / district
            </label>
            <input
              className="portal-input"
              id="area"
              required
              value={form.area}
              onChange={(e) => updateField("area", e.target.value)}
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="city">
              City / LGA
            </label>
            <input
              className="portal-input"
              id="city"
              required
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="state">
              State
            </label>
            <select
              className="portal-select"
              id="state"
              required
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
            >
              <option value="">Select state</option>
              {NIGERIA_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="portal-label" htmlFor="beds">
              Bedrooms
            </label>
            <input
              className="portal-input"
              id="beds"
              type="number"
              min={0}
              value={form.beds}
              onChange={(e) => updateField("beds", e.target.value)}
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="baths">
              Bathrooms
            </label>
            <input
              className="portal-input"
              id="baths"
              type="number"
              min={0}
              value={form.baths}
              onChange={(e) => updateField("baths", e.target.value)}
            />
          </div>
          <div>
            <label className="portal-label" htmlFor="sqm">
              Size (sqm)
            </label>
            <input
              className="portal-input"
              id="sqm"
              type="number"
              min={0}
              value={form.sqm}
              onChange={(e) => updateField("sqm", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="portal-label" htmlFor="features">
            Features (comma-separated)
          </label>
          <input
            className="portal-input"
            id="features"
            placeholder="Security, Parking, Borehole"
            value={form.features}
            onChange={(e) => updateField("features", e.target.value)}
          />
        </div>

        <div>
          <label className="portal-label" htmlFor="image_files">
            Property photos
          </label>
          <input
            className="portal-input"
            id="image_files"
            name="image_files"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="mt-1 text-xs text-adab-gray-500">
            Upload up to 10 images, 5 MB each. Stored securely on Adab.
          </p>
          {previews.length > 0 && (
            <div className="portal-image-preview">
              {previews.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="portal-label" htmlFor="images">
            Additional image URLs (optional)
          </label>
          <textarea
            className="portal-textarea"
            id="images"
            rows={2}
            placeholder="https://…"
            value={form.images}
            onChange={(e) => updateField("images", e.target.value)}
          />
        </div>

        <div>
          <label className="portal-label" htmlFor="status">
            Submission
          </label>
          <select
            className="portal-select"
            id="status"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            <option value="pending_review">Submit for Adab review</option>
            <option value="draft">Save as draft</option>
          </select>
        </div>

        <button
          className="portal-btn portal-btn-secondary w-full"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Saving listing…" : "Save listing"}
        </button>
      </form>
    </>
  );
}
