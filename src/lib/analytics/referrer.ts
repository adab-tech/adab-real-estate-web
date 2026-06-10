export function normalizeReferrerSource(referrer: string | null | undefined): string {
  if (!referrer || referrer.trim() === "") return "direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("google.")) return "google";
    if (host.includes("bing.")) return "bing";
    if (host.includes("facebook.") || host === "fb.com" || host === "l.facebook.com")
      return "facebook";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("twitter.") || host === "t.co" || host.includes("x.com"))
      return "twitter";
    if (host.includes("linkedin.")) return "linkedin";
    if (host.includes("whatsapp.")) return "whatsapp";
    if (host.includes("youtube.")) return "youtube";

    return host;
  } catch {
    return "direct";
  }
}

export function formatReferrerLabel(source: string): string {
  const labels: Record<string, string> = {
    direct: "Direct / none",
    google: "Google",
    bing: "Bing",
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "X / Twitter",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    youtube: "YouTube",
  };
  return labels[source] ?? source;
}
