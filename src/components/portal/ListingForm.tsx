"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
  NIGERIA_STATES,
} from "@/lib/portal/constants";
import { slugifyListing } from "@/lib/portal/format";
import {
  parseNominatimAddress,
  searchNigeriaAddress,
  type NominatimResult,
} from "@/lib/portal/geocode";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ListingForm() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function handleAddressInput(value: string) {
    updateField("address", value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const results = await searchNigeriaAddress(value);
      setSuggestions(results);
    }, 350);
  }

  function selectAddress(item: NominatimResult) {
    const parsed = parseNominatimAddress(item, NIGERIA_STATES);
    setForm((prev) => ({
      ...prev,
      address: parsed.address,
      city: parsed.city,
      state: parsed.state,
      lat: String(parsed.lat),
      lng: String(parsed.lng),
    }));
    setSuggestions([]);
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

      if (upload.error) throw upload.error;

      const publicUrl = client.storage
        .from("property-images")
        .getPublicUrl(path);
      urls.push(publicUrl.data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      const client = createSupabaseBrowserClient();
      const session = await client.auth.getSession();
      if (!session.data.session) {
        router.replace("/portal/login");
        return;
      }

      const userId = session.data.session.user.id;
      const fileInput = event.currentTarget.elements.namedItem(
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
        owner_id: userId,
        slug: slugifyListing(form.title),
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        category: form.category,
        price_ngn: parseInt(form.price_ngn, 10),
        price_period: form.type === "rent" ? form.price_period : null,
        location: {
          address: form.address.trim(),
          area: form.area.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
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

      const result = await client
        .from("properties")
        .insert(payload)
        .select("id, slug, status")
        .single();

      if (result.error) throw result.error;

      const message =
        result.data.status === "pending_review"
          ? "Listing submitted for Adab review. You will be notified once it is approved."
          : "Draft saved successfully.";

      setAlert({ type: "success", message });
      setTimeout(() => router.push("/portal/dashboard"), 1200);
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err instanceof Error ? err.message : "Unable to save listing.",
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

        <div>
          <label className="portal-label" htmlFor="address">
            Street address or landmark
          </label>
          <input
            className="portal-input"
            id="address"
            required
            placeholder="Start typing any Nigerian address…"
            value={form.address}
            onChange={(e) => handleAddressInput(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="portal-suggestions">
              {suggestions.map((item) => (
                <button
                  key={item.display_name}
                  type="button"
                  onClick={() => selectAddress(item)}
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

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
          {submitting ? "Uploading…" : "Save listing"}
        </button>
      </form>
    </>
  );
}
