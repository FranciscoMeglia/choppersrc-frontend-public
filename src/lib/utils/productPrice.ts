import type { Product } from "@/types/product";

export function getDisplayPrice(
  product: Pick<Product, "discount" | "priceUsd" | "finalPriceUsd" | "priceArs" | "finalPriceArs">,
): { usd: string; ars: string } {
  return product.discount
    ? { usd: product.finalPriceUsd, ars: product.finalPriceArs }
    : { usd: product.priceUsd, ars: product.priceArs };
}
