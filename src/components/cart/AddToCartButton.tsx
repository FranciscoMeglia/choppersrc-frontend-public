"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { addLocalItem, dispatchCartUpdated } from "@/lib/cart/localCart";
import { showToast } from "@/lib/toast/toastStore";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Cart } from "@/types/cart";

export function AddToCartButton({
  productId,
  slug,
  className = "",
}: {
  productId: number;
  slug: string;
  className?: string;
}) {
  const t = useTranslations("AddToCartButton");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<Cart>
        | ApiErrorEnvelope;

      if (body.success) {
        dispatchCartUpdated(
          body.data.items.reduce((sum, item) => sum + item.quantity, 0),
        );
        showToast(t("added"));
      } else if (body.statusCode === 401) {
        addLocalItem(productId, slug);
        showToast(t("added"));
      }
    } catch {
      addLocalItem(productId, slug);
      showToast(t("added"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      className={`flex w-full items-center justify-center gap-2 ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 animate-spin"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth={2}
            className="opacity-25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 5h13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M15 6v4M13 8h4" strokeLinecap="round" />
        </svg>
      )}
      {loading ? t("adding") : t("add")}
    </Button>
  );
}
