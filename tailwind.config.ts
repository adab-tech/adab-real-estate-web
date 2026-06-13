import type { Config } from "tailwindcss";

/**
 * Breakpoint strategy (mobile-first):
 *
 * - Base (default, < 360px): single-column layouts, compact typography,
 *   tighter padding, 44px minimum touch targets on interactive controls.
 * - phone (360px+): standard phone spacing and type scale.
 * - tablet (768px+): two-column grids, increased horizontal padding.
 * - desktop (991px+): desktop navigation, three-column grids and up.
 * - wide (1200px+): site max-width cap — use max-w-site (1200px) for containers.
 *
 * Grid columns: 1 col (base) → 2 col (tablet) → 3+ col (desktop/wide).
 * Prefer phone:/tablet:/desktop:/wide: over default sm/md/lg/xl utilities.
 *
 * Theme tokens are mirrored in src/app/globals.css @theme for Tailwind v4.
 */
export default {
  theme: {
    extend: {
      screens: {
        phone: "360px",
        tablet: "768px",
        desktop: "991px",
        wide: "1200px",
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
} satisfies Config;
