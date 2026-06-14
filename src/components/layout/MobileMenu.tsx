"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type MobileNavLink = {
  href: string;
  label: string;
  active?: boolean;
};

type MobileMenuProps = {
  links: MobileNavLink[];
  /** Accessible name for the navigation region */
  navLabel?: string;
  /** Optional actions rendered below nav links (e.g. sign-in buttons) */
  actions?: React.ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  links,
  navLabel = "Mobile navigation",
  actions,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    focusables[0]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div className="desktop:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="touch-target rounded-lg border border-adab-gray-300 text-adab-navy-800 transition-colors hover:border-adab-gold-500 hover:text-adab-gold-500"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg
          aria-hidden
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex justify-end"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-adab-navy-900/40"
            aria-label="Close menu"
            onClick={close}
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={navLabel}
            className="relative flex h-full w-[min(100%,20rem)] flex-col border-l border-adab-gray-300 bg-adab-paper shadow-xl"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between border-b border-adab-gray-300 px-4 py-3">
              <p className="font-display text-sm font-semibold text-adab-navy-800">
                Menu
              </p>
              <button
                type="button"
                className="touch-target rounded-lg text-adab-navy-800 hover:text-adab-gold-500"
                aria-label="Close menu"
                onClick={close}
              >
                <svg
                  aria-hidden
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto px-4 py-4"
              aria-label={navLabel}
            >
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`touch-target flex w-full rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        link.active
                          ? "bg-adab-cream text-adab-gold-600"
                          : "text-adab-navy-800 hover:bg-adab-cream hover:text-adab-gold-500"
                      }`}
                      onClick={close}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {actions ? (
              <div className="space-y-3 border-t border-adab-gray-300 px-4 py-4">
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
