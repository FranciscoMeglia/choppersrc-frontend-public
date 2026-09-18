"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartCount } from "@/lib/cart/useCartCount";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { loadCartLines } from "@/lib/cart/mapCart";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatUsd } from "@/lib/utils/formatPrice";
import type { CartLineItem } from "@/types/cart";

export function CartIcon({
  initialCount,
  isAuthenticated,
}: {
  initialCount: number;
  isAuthenticated: boolean;
}) {
  const t = useTranslations("CartIcon");
  const tCommon = useTranslations("Common");
  const count = useCartCount(initialCount);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartLineItem[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadCartLines(isAuthenticated).then((lines) => {
      if (!cancelled) setItems(lines);
    });
    return () => {
      cancelled = true;
    };
  }, [open, isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const subtotalUsd = items?.reduce(
    (sum, item) => sum + Number(item.finalPriceUsd) * item.quantity,
    0,
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center p-2 text-ink hover:text-primary"
        aria-label={t("ariaLabel")}
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-6 w-6"
        >
          <path
            d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 5h13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-80 overflow-hidden rounded border border-ink/10 bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-sm font-semibold">{t("title")}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="text-ink/40 hover:text-primary"
            >
              ✕
            </button>
          </div>

          {items === null ? (
            <p className="p-4 text-sm text-ink/50">{t("loading")}</p>
          ) : items.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-ink/60">{t("empty")}</p>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="group mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                {tCommon("viewCatalog")}
                <ArrowRight />
              </Link>
            </div>
          ) : (
            <>
              <ul className="max-h-80 divide-y divide-ink/5 overflow-y-auto">
                {items.map((item) => {
                  const cover = item.images[0];
                  return (
                    <li key={item.productId}>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-ink/5"
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
                            {item.name}
                          </p>
                          <p className="text-xs text-ink/50">
                            {item.quantity} × {formatUsd(item.finalPriceUsd)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-ink/10 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{t("subtotal")}</span>
                  <span className="font-semibold">
                    {formatUsd(String(subtotalUsd ?? 0))}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="group mt-3 block rounded bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-hover"
                >
                  {t("viewFullCart")}
                  <ArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
