"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";

const initialState: InquiryState = {
  success: false,
  message: "",
};

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
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  if (state.success) {
    return (
      <div
        className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        role="status"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {propertyId ? (
        <input type="hidden" name="propertyId" value={propertyId} />
      ) : null}
      {propertySlug ? (
        <input type="hidden" name="propertySlug" value={propertySlug} />
      ) : null}
      <input type="hidden" name="source" value={source} />

      {state.message && !state.success ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      ) : null}

      <Field
        label="Full name"
        name="name"
        type="text"
        required
        errors={state.fieldErrors?.name}
      />
      <Field
        label="Phone (WhatsApp)"
        name="phone"
        type="tel"
        placeholder="+234 801 234 5678"
        required
        errors={state.fieldErrors?.phone}
      />
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        errors={state.fieldErrors?.email}
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
        {state.fieldErrors?.message ? (
          <p className="mt-1 text-xs text-red-600">
            {state.fieldErrors.message[0]}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-adab-navy-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send inquiry"}
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
  errors?: string[];
};

function Field({ label, name, type, placeholder, required, errors }: FieldProps) {
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
      {errors?.[0] ? (
        <p className="mt-1 text-xs text-red-600">{errors[0]}</p>
      ) : null}
    </div>
  );
}
