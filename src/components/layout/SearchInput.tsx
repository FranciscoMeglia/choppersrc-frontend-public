"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api/client";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { imageUrl } from "@/lib/utils/imageUrl";
import { getDisplayPrice } from "@/lib/utils/productPrice";
import { formatUsd } from "@/lib/utils/formatPrice";
import type { Product } from "@/types/product";

const MIN_QUERY_LENGTH = 2;
const RESULTS_LIMIT = 6;
const DEBOUNCE_MS = 250;

export function SearchInput({ className = "w-full" }: { className?: string }) {
  const t = useTranslations("SearchInput");
  const router = useRouter();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = value.trim();
    abortRef.current?.abort();
    if (query.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(() => {
      setResults(null);
      setLoading(true);
      apiFetch<Product[]>(
        `/products?q=${encodeURIComponent(query)}&limit=${RESULTS_LIMIT}`,
        { signal: controller.signal },
      )
        .then((products) => {
          setResults(products);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setResults([]);
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    goToFullResults();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.blur();
    }
  }

  function goToFullResults() {
    const query = value.trim();
    setOpen(false);
    router.push(
      query ? `/products?q=${encodeURIComponent(query)}` : "/products",
    );
  }

  function handleClear() {
    setValue("");
    setResults(null);
    inputRef.current?.focus();
  }

  const query = value.trim();
  const showDropdown = open && query.length >= MIN_QUERY_LENGTH;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="w-full rounded-full border border-ink/15 bg-white px-4 py-2 pr-9 text-sm focus:border-primary focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          autoComplete="off"
          aria-label={t("ariaLabel")}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("clearAria")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-primary hover:text-primary-hover"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 z-20 mt-2 w-96 max-w-[90vw] overflow-hidden rounded border border-ink/10 bg-background shadow-lg">
          {results === null || loading ? (
            <p className="p-4 text-sm text-ink/50">{t("loading")}</p>
          ) : results.length > 0 ? (
            <>
              <ul className="max-h-96 divide-y divide-ink/5 overflow-y-auto">
                {results.map((product) => {
                  const cover = product.images[0];
                  const price = getDisplayPrice(product);
                  return (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-ink/5"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-ink/5">
                          {cover && (
                            <Image
                              src={imageUrl(cover)}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="truncate text-xs text-ink/40">
                              {product.sku}
                            </p>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-medium">
                          {formatUsd(price.usd)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={goToFullResults}
                className="group block w-full border-t border-ink/10 p-2.5 text-center text-sm font-medium text-primary hover:bg-ink/5 hover:underline"
              >
                {t("viewAllResults")}
                <ArrowRight />
              </button>
            </>
          ) : (
            <p className="p-4 text-sm text-ink/50">{t("noResults", { query })}</p>
          )}
        </div>
      )}
    </div>
  );
}
