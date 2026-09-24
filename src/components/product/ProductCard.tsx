import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PriceTag } from "@/components/ui/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { StockAlertButton } from "@/components/product/StockAlertButton";
import { imageUrl } from "@/lib/utils/imageUrl";
import { getDisplayPrice } from "@/lib/utils/productPrice";
import type { Product } from "@/types/product";

function percentOff(product: Product): number | null {
  if (!product.discount) return null;
  const price = Number(product.priceUsd);
  const final = Number(product.finalPriceUsd);
  if (!price || final >= price) return null;
  return Math.round((1 - final / price) * 100);
}

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("ProductDetail");
  const price = getDisplayPrice(product);
  const cover = product.images[0];
  const discount = percentOff(product);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-background shadow-sm transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ink/5"
      >
        {cover ? (
          <Image
            src={imageUrl(cover)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="h-16 w-16"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path
                d="m21 15-5-5L5 21"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {discount !== null && (
          <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            −{discount}%
          </span>
        )}
        {product.condition === "USED" && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 shadow-sm">
            {t("used")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          {product.brand && (
            <p className="text-xs font-medium text-ink/50 uppercase">
              {product.brand.name}
            </p>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="mt-0.5 line-clamp-2 min-h-10 text-sm font-medium hover:text-primary"
          >
            {product.name}
          </Link>
        </div>

        <div className="text-sm">
          <PriceTag usd={price.usd} ars={price.ars} showEstimate={false} />
        </div>

        {product.stock > 0 ? (
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            stock={product.stock}
            className="mt-auto"
          />
        ) : (
          <StockAlertButton slug={product.slug} className="mt-auto w-full" />
        )}
      </div>
    </div>
  );
}
