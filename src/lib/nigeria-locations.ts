/** All 36 Nigerian states plus FCT (Federal Capital Territory). */
export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigeriaState = (typeof NIGERIA_STATES)[number];

/** Major cities per state for property browse filters. */
export const NIGERIA_CITIES_BY_STATE: Record<NigeriaState, readonly string[]> = {
  Abia: ["Aba", "Umuahia"],
  Adamawa: ["Yola", "Mubi"],
  "Akwa Ibom": ["Uyo", "Eket"],
  Anambra: ["Awka", "Onitsha", "Nnewi"],
  Bauchi: ["Bauchi", "Azare"],
  Bayelsa: ["Yenagoa"],
  Benue: ["Makurdi", "Gboko"],
  Borno: ["Maiduguri"],
  "Cross River": ["Calabar", "Ugep"],
  Delta: ["Warri", "Asaba", "Sapele"],
  Ebonyi: ["Abakaliki"],
  Edo: ["Benin City", "Auchi"],
  Ekiti: ["Ado-Ekiti", "Ikere"],
  Enugu: ["Enugu", "Nsukka"],
  FCT: ["Abuja", "Gwagwalada", "Kuje"],
  Gombe: ["Gombe"],
  Imo: ["Owerri", "Orlu"],
  Jigawa: ["Dutse", "Hadejia"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan"],
  Kano: ["Kano", "Wudil"],
  Katsina: ["Katsina", "Daura"],
  Kebbi: ["Birnin Kebbi"],
  Kogi: ["Lokoja", "Okene"],
  Kwara: ["Ilorin", "Offa"],
  Lagos: [
    "Lagos Island",
    "Victoria Island",
    "Lekki",
    "Ikeja",
    "Surulere",
    "Yaba",
    "Ajah",
    "Ikorodu",
  ],
  Nasarawa: ["Lafia", "Keffi"],
  Niger: ["Minna", "Bida"],
  Ogun: ["Abeokuta", "Sagamu", "Ijebu-Ode"],
  Ondo: ["Akure", "Ondo City"],
  Osun: ["Osogbo", "Ile-Ife", "Ilesa"],
  Oyo: ["Ibadan", "Ogbomoso"],
  Plateau: ["Jos", "Bukuru"],
  Rivers: ["Port Harcourt", "Bonny"],
  Sokoto: ["Sokoto"],
  Taraba: ["Jalingo"],
  Yobe: ["Damaturu", "Potiskum"],
  Zamfara: ["Gusau"],
};

/** Flat list of all major cities (sorted, deduplicated). */
export const ALL_NIGERIA_CITIES: string[] = [
  ...new Set(
    Object.values(NIGERIA_CITIES_BY_STATE).flatMap((cities) => [...cities]),
  ),
].sort((a, b) => a.localeCompare(b));

export function citiesForState(state: string): string[] {
  if (!state || state === "all") return ALL_NIGERIA_CITIES;
  const cities = NIGERIA_CITIES_BY_STATE[state as NigeriaState];
  return cities ? [...cities].sort((a, b) => a.localeCompare(b)) : [];
}

export function normalizeLocationText(value: string): string {
  return value.trim().toLowerCase();
}

export function locationMatches(
  location: { city?: string; state?: string },
  filters: { city?: string; state?: string },
): boolean {
  if (filters.state && filters.state !== "all") {
    const state = normalizeLocationText(location.state ?? "");
    const filterState = normalizeLocationText(filters.state);
    if (state !== filterState && !state.includes(filterState)) {
      return false;
    }
  }

  if (filters.city && filters.city !== "all") {
    const city = normalizeLocationText(location.city ?? "");
    const filterCity = normalizeLocationText(filters.city);
    if (city !== filterCity && !city.includes(filterCity)) {
      return false;
    }
  }

  return true;
}
