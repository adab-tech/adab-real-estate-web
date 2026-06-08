export type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function searchNigeriaAddress(
  query: string,
): Promise<NominatimResult[]> {
  if (!query || query.length < 3) return [];

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&countrycodes=ng&limit=6&q=" +
    encodeURIComponent(`${query}, Nigeria`);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];
  return response.json();
}

export function parseNominatimAddress(
  item: NominatimResult,
  states: readonly string[],
): {
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
} {
  const parts = item.display_name.split(",").map((p) => p.trim());
  let city = "";
  let state = "";

  for (const part of parts) {
    for (const s of states) {
      if (part.toLowerCase().includes(s.toLowerCase())) {
        state = s;
      }
    }
    if (!city && part.length > 2 && part !== "Nigeria") {
      city = part;
    }
  }

  return {
    address: parts[0] ?? "",
    city,
    state,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  };
}
