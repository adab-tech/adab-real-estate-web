/** Nigerian ISO 3166-2 region codes → state names (Vercel geo). */
const NG_STATE_CODES: Record<string, string> = {
  AB: "Abia",
  AD: "Adamawa",
  AK: "Akwa Ibom",
  AN: "Anambra",
  BA: "Bauchi",
  BE: "Benue",
  BO: "Borno",
  BY: "Bayelsa",
  CR: "Cross River",
  DE: "Delta",
  EB: "Ebonyi",
  ED: "Edo",
  EK: "Ekiti",
  EN: "Enugu",
  FC: "FCT",
  GO: "Gombe",
  IM: "Imo",
  JI: "Jigawa",
  KD: "Kaduna",
  KE: "Kebbi",
  KN: "Kano",
  KO: "Kogi",
  KT: "Katsina",
  KW: "Kwara",
  LA: "Lagos",
  NA: "Nasarawa",
  NI: "Niger",
  OG: "Ogun",
  ON: "Ondo",
  OS: "Osun",
  OY: "Oyo",
  PL: "Plateau",
  RI: "Rivers",
  SO: "Sokoto",
  TA: "Taraba",
  YO: "Yobe",
  ZA: "Zamfara",
};

export type GeoInfo = {
  country: string | null;
  region: string | null;
  city: string | null;
};

export function extractGeoFromHeaders(headers: Headers): GeoInfo {
  const country =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    null;

  let region =
    headers.get("x-vercel-ip-country-region") ??
    headers.get("cf-region") ??
    null;

  const city =
    headers.get("x-vercel-ip-city") ??
    headers.get("cf-ipcity") ??
    null;

  if (country === "NG" && region) {
    const code = region.toUpperCase();
    region = NG_STATE_CODES[code] ?? region;
  }

  return { country, region, city };
}

export function formatCountryLabel(code: string | null): string {
  if (!code) return "Unknown";
  if (code === "NG") return "Nigeria";
  return code;
}
