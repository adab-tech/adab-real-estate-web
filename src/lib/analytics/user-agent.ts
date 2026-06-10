export type DeviceInfo = {
  deviceType: "mobile" | "tablet" | "desktop" | "unknown";
  browser: string;
};

export function parseUserAgent(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return { deviceType: "unknown", browser: "unknown" };
  }

  const ua = userAgent;
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua);
  const isMobile =
    !isTablet && /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  let deviceType: DeviceInfo["deviceType"] = "desktop";
  if (isTablet) deviceType = "tablet";
  else if (isMobile) deviceType = "mobile";

  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/CriOS\//i.test(ua) || /Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  return { deviceType, browser };
}
