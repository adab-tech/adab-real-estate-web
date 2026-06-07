"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type InquiryFormProps = {
  propertyId?: string;
  propertySlug?: string;
  source?: "contact" | "property_detail";
};

type FieldErrors = Record<string, string>;

export function InquiryForm({
  propertyId,
  propertySlug,
  source = "contact",
}: InquiryFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(form: FormData): FieldErrors {
    const errors: FieldErrors = {};
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (name.length < 2) errors.name = "Please enter your full name.";
    if (phone.length < 7) errors.phone = "Please enter a valid phone number.";
    if (message.length < 10) errors.message = "Please enter a longer message.";

    return errors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const errors = validate(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors below.");
      setSuccess(false);
      return;
    }

    const name = String(form.get("name")).trim();
    const phone = String(form.get("phone")).trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message")).trim();

    const lines = [
      `Hi Adab, I'd like to get in touch.`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      propertySlug ? `Property: ${propertySlug}` : null,
      `Source: ${source}`,
      "",
      message,
    ].filter(Boolean);

    const whatsappUrl = `${siteConfig.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFieldErrors({});
    setError("");
    setSuccess(true);
  }

  if (success) {
    return (
      <div
        className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        role="status"
      >
        WhatsApp opened with your message. If it did not open, call us at{" "}
        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="font-semibold underline">
          {siteConfig.phone}
        </a>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Field
        label="Full name"
        name="name"
        type="text"
        required
        error={fieldErrors.name}
      />
      <Field
        label="Phone (WhatsApp)"
        name="phone"
        type="tel"
        placeholder="+234 801 234 5678"
        required
        error={fieldErrors.phone}
      />
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        error={fieldErrors.email}
      />
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-adab-navy-800"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={
            source === "property_detail"
              ? "I'd like to schedule a viewing..."
              : "How can we help you?"
          }
          className="w-full rounded-xl border border-adab-gray-300 px-4 py-3 text-sm text-adab-navy-800 outline-none transition-colors focus:border-adab-gold-500"
        />
        {fieldErrors.message ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-adab-navy-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
      >
        Send via WhatsApp
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

function Field({ label, name, type, placeholder, required, error }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-adab-navy-800"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-adab-gray-300 px-4 py-3 text-sm text-adab-navy-800 outline-none transition-colors focus:border-adab-gold-500"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
