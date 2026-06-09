"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { NIGERIA_STATES } from "@/lib/portal/constants";
import {
  DEBOUNCE_MS,
  MIN_QUERY_LENGTH,
  parseNominatimAddress,
  searchNigeriaAddress,
  type NominatimResult,
  type ParsedAddress,
} from "@/lib/portal/geocode";

type AddressAutocompleteProps = {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onSelect: (parsed: ParsedAddress) => void;
};

export function AddressAutocomplete({
  id,
  label,
  value,
  required,
  placeholder,
  onValueChange,
  onSelect,
}: AddressAutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const selectingRef = useRef(false);

  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const closeList = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
    setHasSearched(false);
  }, []);

  const selectItem = useCallback(
    (item: NominatimResult) => {
      const parsed = parseNominatimAddress(item, NIGERIA_STATES);
      onValueChange(parsed.address);
      onSelect(parsed);
      closeList();
      selectingRef.current = false;
    },
    [closeList, onSelect, onValueChange],
  );

  const runSearch = useCallback(async (query: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setHasSearched(false);

    try {
      const results = await searchNigeriaAddress(query, controller.signal);
      if (requestId !== requestIdRef.current) return;

      setSuggestions(results);
      setOpen(true);
      setActiveIndex(results.length > 0 ? 0 : -1);
      setHasSearched(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (requestId !== requestIdRef.current) return;
      setSuggestions([]);
      setOpen(true);
      setActiveIndex(-1);
      setHasSearched(true);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  function handleInput(nextValue: string) {
    onValueChange(nextValue);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (nextValue.trim().length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setLoading(false);
      closeList();
      return;
    }

    timerRef.current = setTimeout(() => {
      runSearch(nextValue);
    }, DEBOUNCE_MS);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (event.key === "ArrowDown" && value.trim().length >= MIN_QUERY_LENGTH) {
        event.preventDefault();
        if (suggestions.length === 0 && !loading) {
          runSearch(value);
        } else {
          setOpen(true);
          setActiveIndex(0);
        }
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        suggestions.length === 0 ? -1 : (prev + 1) % suggestions.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        suggestions.length === 0
          ? -1
          : prev <= 0
            ? suggestions.length - 1
            : prev - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectItem(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeList();
    }
  }

  function handleBlur() {
    if (selectingRef.current) return;
    window.setTimeout(() => {
      if (selectingRef.current) return;
      closeList();
    }, 150);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const showList =
    open && (loading || hasSearched) && value.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="portal-address-field" ref={containerRef}>
      <label className="portal-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        className="portal-input"
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && activeIndex >= 0
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (
            suggestions.length > 0 &&
            value.trim().length >= MIN_QUERY_LENGTH
          ) {
            setOpen(true);
          }
        }}
        onBlur={handleBlur}
      />
      {showList && (
        <div
          id={listId}
          className="portal-suggestions"
          role="listbox"
          onMouseDown={() => {
            selectingRef.current = true;
          }}
        >
          {loading && (
            <div className="portal-suggestions-status" role="status">
              Searching Nigerian addresses…
            </div>
          )}
          {!loading && suggestions.length === 0 && hasSearched && (
            <div className="portal-suggestions-status" role="status">
              No results found. Try a nearby landmark or city.
            </div>
          )}
          {!loading &&
            suggestions.map((item, index) => (
              <button
                key={item.place_id}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex ? "portal-suggestion-active" : undefined
                }
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectingRef.current = true;
                }}
                onClick={() => selectItem(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {item.display_name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
