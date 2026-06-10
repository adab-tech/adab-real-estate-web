"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "adab_vid";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function sendPageView(path: string) {
  const payload = JSON.stringify({
    path,
    referrer: document.referrer || null,
    visitorId: getVisitorId(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics/collect",
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export function PageViewBeacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;
    sendPageView(pathname);
  }, [pathname]);

  return null;
}
