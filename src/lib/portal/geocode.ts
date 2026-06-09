export const DEBOUNCE_MS = 300;
export const MIN_QUERY_LENGTH = 3;

export type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export type ParsedAddress = {
  address: string;
  area: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  mapUrl: string;
};

export async function searchNigeriaAddress(
  query: string,
  signal?: AbortSignal,
): Promise<NominatimResult[]> {
  if (!query || query.trim().length < MIN_QUERY_LENGTH) return [];

  const response = await fetch(
    `/api/geocode?q=${encodeURIComponent(query)}`,
    {
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) return [];
  const data = (await response.json()) as NominatimResult[];
  return Array.isArray(data) ? data : [];
}

export function buildMapUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function parseNominatimAddress(
  item: NominatimResult,
  states: readonly string[],
): ParsedAddress {
  const parts = item.display_name.split(",").map((p) => p.trim());
  const address = parts[0] ?? "";
  let state = "";
  let city = "";
  let area = "";

  const stateIndex = parts.findIndex((part) =>
    states.some((s) => part.toLowerCase().includes(s.toLowerCase())),
  );

  if (stateIndex >= 0) {
    state =
      states.find((s) =>
        parts[stateIndex].toLowerCase().includes(s.toLowerCase()),
      ) ?? "";
    if (stateIndex > 0) {
      city = parts[stateIndex - 1] ?? "";
    }
    if (stateIndex > 2) {
      area = parts[1] ?? "";
    } else if (stateIndex === 2) {
      area = parts[1] ?? "";
    }
  } else if (parts.length > 2) {
    city = parts[1] ?? "";
    area = parts.length > 3 ? (parts[2] ?? "") : "";
  }

  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);

  return {
    address,
    area,
    city,
    state,
    lat,
    lng,
    mapUrl: buildMapUrl(lat, lng),
  };
}
