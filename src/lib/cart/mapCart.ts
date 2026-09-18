import { apiFetch } from "@/lib/api/client";
import { getLocalCart, removeLocalItem } from "@/lib/cart/localCart";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Cart, CartLineItem } from "@/types/cart";
import type { Product } from "@/types/product";

export function productToLineItem(
  product: Product,
  quantity: number,
): CartLineItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    quantity,
    priceUsd: product.priceUsd,
    priceArs: product.priceArs,
    finalPriceUsd: product.finalPriceUsd,
    finalPriceArs: product.finalPriceArs,
    stock: product.stock,
    images: product.images,
  };
}

export function cartToLines(
  cart: Cart,
): { productId: number; slug: string; quantity: number }[] {
  return cart.items.map((item) => ({
    productId: item.productId,
    slug: item.product.slug,
    quantity: item.quantity,
  }));
}

export async function fetchCartLine(
  slug: string,
  quantity: number,
): Promise<CartLineItem | null> {
  try {
    const product = await apiFetch<Product>(`/products/${slug}`);
    return productToLineItem(product, quantity);
  } catch {
    return null;
  }
}

export async function hydrateCartLines(
  lines: { slug: string; quantity: number }[],
): Promise<CartLineItem[]> {
  const results = await Promise.all(
    lines.map((line) => fetchCartLine(line.slug, line.quantity)),
  );
  return results.filter((item): item is CartLineItem => item !== null);
}

export function cartItemCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function loadCartLines(
  isAuthenticated: boolean,
): Promise<CartLineItem[]> {
  if (isAuthenticated) {
    const res = await fetch("/api/backend/cart");
    const body = (await res.json()) as
      | ApiSuccessEnvelope<Cart>
      | ApiErrorEnvelope;
    return body.success ? hydrateCartLines(cartToLines(body.data)) : [];
  }

  const local = getLocalCart();
  const lines = await Promise.all(
    local.map(async (line) => {
      const hydrated = await fetchCartLine(line.slug, line.quantity);
      if (!hydrated) removeLocalItem(line.productId);
      return hydrated;
    }),
  );
  return lines.filter((line): line is CartLineItem => line !== null);
}
