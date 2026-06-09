import { NextResponse } from "next/server";

const NOMINATIM_BASE =
  "https://nominatim.openstreetmap.org/search?format=json&countrycodes=ng&limit=6&addressdetails=0&q=";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 3) {
    return NextResponse.json([]);
  }

  const url = NOMINATIM_BASE + encodeURIComponent(`${query}, Nigeria`);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Adab Real Estate Portal (hello@adab.ng)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json([], { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
