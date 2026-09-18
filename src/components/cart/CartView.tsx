"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { CartSummary } from "./CartSummary";
import { dispatchCartUpdated, removeLocalItem, updateLocalItem } from "@/lib/cart/localCart";
import { cartToLines, hydrateCartLines, loadCartLines } from "@/lib/cart/mapCart";
import { imageUrl } from "@/lib/utils/imageUrl";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Cart, CartLineItem } from "@/types/cart";

export function CartView({
  isAuthenticated,
  initialItems,
}: {
  isAuthenticated: boolean;
  initialItems: CartLineItem[];
}) {
  const t = useTranslations("CartView");
  const tCommon = useTranslations("Common");
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;
    let cancelled = false;

    loadCartLines(false).then((lines) => {
      if (!cancelled) {
        setItems(lines);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function applyBackendMutation(request: () => Promise<Response>) {
    const res = await request();
    const body = (await res.json()) as
      | ApiSuccessEnvelope<Cart>
      | ApiErrorEnvelope;
    if (body.success) {
      setItems(await hydrateCartLines(cartToLines(body.data)));
      dispatchCartUpdated(
        body.data.items.reduce((sum, item) => sum + item.quantity, 0),
      );
    }
  }

  async function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) return removeItem(productId);

    if (isAuthenticated) {
      await applyBackendMutation(() =>
        fetch(`/api/backend/cart/items/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }),
      );
    } else {
      updateLocalItem(productId, quantity);
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    }
  }

  async function removeItem(productId: number) {
    if (isAuthenticated) {
      await applyBackendMutation(() =>
        fetch(`/api/backend/cart/items/${productId}`, { method: "DELETE" }),
      );
    } else {
      removeLocalItem(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    }
  }

  if (loading) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-6 text-sm text-ink/60">{t("loading")}</p>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-6 text-sm text-ink/60">
          {t("empty")}{" "}
          <Link href="/products" className="group text-primary hover:underline">
            {tCommon("viewCatalog")}
            <ArrowRight />
          </Link>
        </p>
      </Container>
    );
  }

  const subtotalUsd = items.reduce(
    (sum, item) => sum + Number(item.finalPriceUsd) * item.quantity,
    0,
  );
  const subtotalArs = items.reduce(
    (sum, item) => sum + Number(item.finalPriceArs) * item.quantity,
    0,
  );

  return (
    <Container>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-wrap items-center gap-4 rounded border border-ink/10 p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-ink/5">
                {item.images[0] && (
                  <Image
                    src={imageUrl(item.images[0])}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="block truncate font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
                <PriceTag usd={item.finalPriceUsd} ars={item.finalPriceArs} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  aria-label={t("decrease")}
                  className="rounded border border-ink/20 px-2 py-1 hover:border-primary hover:text-primary"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  aria-label={t("increase")}
                  className="rounded border border-ink/20 px-2 py-1 hover:border-primary hover:text-primary"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm text-ink/40 hover:text-primary"
              >
                {t("remove")}
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <CartSummary
            subtotalUsd={String(subtotalUsd)}
            subtotalArs={String(subtotalArs)}
          />
          {isAuthenticated ? (
            <LinkButton href="/checkout" className="group">
              {t("continueToCheckout")}
              <ArrowRight />
            </LinkButton>
          ) : (
            <LinkButton href="/login?redirect=/checkout" className="group">
              {t("loginToContinue")}
              <ArrowRight />
            </LinkButton>
          )}
        </div>
      </div>
    </Container>
  );
}
