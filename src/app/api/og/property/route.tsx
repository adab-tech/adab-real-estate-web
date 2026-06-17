import { ImageResponse } from "@vercel/og";
import { PRODUCTION_URL } from "@/lib/domain";

export const runtime = "edge";

const NAVY = "#1B2A4A";
const GOLD = "#C9A227";
const CREAM = "#F8F6F1";

function getSiteOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  try {
    return new URL(request.url).origin;
  } catch {
    return PRODUCTION_URL;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Property Listing").slice(0, 120);
  const price = (searchParams.get("price") ?? "").slice(0, 40);
  const location = (searchParams.get("location") ?? "Nigeria").slice(0, 80);
  const image = searchParams.get("image");

  const origin = getSiteOrigin(request);
  const logoUrl = `${origin}/brand/logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: NAVY,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {image ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              inset: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.35,
              }}
            />
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 64px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Adab" height={48} />
            <span
              style={{
                color: CREAM,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Adab Real Estate
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 700,
                color: CREAM,
                lineHeight: 1.15,
                maxWidth: 900,
              }}
            >
              {title}
            </div>
            {price ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  fontWeight: 700,
                  color: GOLD,
                }}
              >
                {price}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: CREAM,
                opacity: 0.9,
              }}
            >
              {location}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: CREAM, fontSize: 22, opacity: 0.8 }}>
              adab.ng
            </span>
            <div
              style={{
                display: "flex",
                width: 120,
                height: 6,
                backgroundColor: GOLD,
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
