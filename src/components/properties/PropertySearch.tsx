import Link from "next/link";
import type { ReactNode } from "react";
import { getPropertyCities } from "@/lib/properties";
import type { PropertyFilters } from "@/types/property";

type PropertySearchProps = {
  filters: PropertyFilters;
};

function buildQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.city && filters.city !== "all") params.set("city", filters.city);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.beds) params.set("beds", String(filters.beds));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function PropertySearch({ filters }: PropertySearchProps) {
  const cities = getPropertyCities();

  return (
    <form
      method="get"
      action="/properties"
      className="rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-[0_4px_24px_rgba(27,42,74,0.08)]"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Listing type" name="type">
          <select
            id="type"
            name="type"
            defaultValue={filters.type ?? "all"}
            className={inputClass}
          >
            <option value="all">All types</option>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </Field>

        <Field label="City" name="city">
          <select
            id="city"
            name="city"
            defaultValue={filters.city ?? "all"}
            className={inputClass}
          >
            <option value="all">All cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Min price (₦)" name="minPrice">
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min={0}
            step={500000}
            placeholder="e.g. 5000000"
            defaultValue={filters.minPrice ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Max price (₦)" name="maxPrice">
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min={0}
            step={500000}
            placeholder="e.g. 100000000"
            defaultValue={filters.maxPrice ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Min bedrooms" name="beds">
          <select
            id="beds"
            name="beds"
            defaultValue={filters.beds ? String(filters.beds) : ""}
            className={inputClass}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-adab-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-adab-navy-700"
        >
          Search properties
        </button>
        <Link
          href="/properties"
          className="rounded-full border border-adab-gray-300 px-5 py-2.5 text-sm font-semibold text-adab-navy-800 transition-colors hover:border-adab-gold-500"
        >
          Clear filters
        </Link>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-adab-gray-300 px-3 py-2.5 text-sm text-adab-navy-800 outline-none focus:border-adab-gold-500";

type FieldProps = {
  label: string;
  name: string;
  children: ReactNode;
};

function Field({ label, name, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-adab-gray-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export { buildQuery };
