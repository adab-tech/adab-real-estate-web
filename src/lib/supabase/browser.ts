import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return document.cookie
          .split(";")
          .map((chunk) => {
            const trimmed = chunk.trim();
            const eq = trimmed.indexOf("=");
            if (eq === -1) return { name: trimmed, value: "" };
            return {
              name: trimmed.slice(0, eq),
              value: decodeURIComponent(trimmed.slice(eq + 1)),
            };
          })
          .filter((cookie) => cookie.name.length > 0);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const parts = [
            `${name}=${encodeURIComponent(value)}`,
            `path=${options?.path ?? "/"}`,
          ];
          if (options?.maxAge != null) parts.push(`max-age=${options.maxAge}`);
          if (options?.domain) parts.push(`domain=${options.domain}`);
          if (options?.sameSite) parts.push(`samesite=${options.sameSite}`);
          if (options?.secure) parts.push("secure");
          document.cookie = parts.join("; ");
        });
      },
    },
  });
}
