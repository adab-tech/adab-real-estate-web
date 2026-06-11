"use client";

import { useActionState, useTransition } from "react";
import { submitInquiry, type InquiryFormState } from "@/app/inquiry-actions";
import { siteConfig } from "@/lib/site-config";

type InquiryFormProps = {
  propertyId?: string;
  propertySlug?: string;
  source?: "contact" | "property_detail";
};

export function InquiryForm({
  propertyId,
  propertySlug,
  source = "contact",
}: InquiryFormProps) {
  const [state, formAction] = useActionState<InquiryFormState, FormData>(
    submitInquiry,
    null,
  );
  const [pending, startTransition] = useTransition();

  function openWhatsApp(form: FormData) {
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
  }

  if (state?.success) {
    return (
      <div
        className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        role="status"
      >
        {state.success} If WhatsApp did not open, call us at{" "}
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="font-semibold underline"
        >
          {siteConfig.phone}
        </a>
        .
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        openWhatsApp(formData);
        startTransition(() => {
          formAction(formData);
        });
      }}
    >
      {state?.error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <input type="hidden" name="propertyId" value={propertyId ?? ""} />
      <input type="hidden" name="propertySlug" value={propertySlug ?? ""} />
      <input type="hidden" name="source" value={source} />

      <Field label="Full name" name="name" type="text" required />
      <Field
        label="Phone (WhatsApp)"
        name="phone"
        type="tel"
        placeholder="+234 801 234 5678"
        required
      />
      <Field label="Email (optional)" name="email" type="email" />
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
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-adab-navy-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send via WhatsApp"}
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
};

function Field({ label, name, type, placeholder, required }: FieldProps) {
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
    </div>
  );
}
