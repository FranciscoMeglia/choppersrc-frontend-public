import Image from "next/image";
import { useTranslations } from "next-intl";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatArs, formatUsd } from "@/lib/utils/formatPrice";
import type { CartLineItem } from "@/types/cart";
import type { CouponPreview } from "@/types/coupon";

export function OrderSummary({
  items,
  coupon,
}: {
  items: CartLineItem[];
  coupon: CouponPreview | null;
}) {
  const t = useTranslations("OrderSummary");
  const tCartSummary = useTranslations("CartSummary");
  const subtotalUsd = items.reduce(
    (sum, item) => sum + Number(item.finalPriceUsd) * item.quantity,
    0,
  );
  const subtotalArs = items.reduce(
    (sum, item) => sum + Number(item.finalPriceArs) * item.quantity,
    0,
  );

  const discountUsd = coupon ? Number(coupon.discount) : 0;
  const discountArs =
    coupon && subtotalUsd > 0 ? discountUsd * (subtotalArs / subtotalUsd) : 0;

  const totalUsd = subtotalUsd - discountUsd;
  const totalArs = subtotalArs - discountArs;

  return (
    <div className="flex flex-col gap-4 rounded border border-ink/10 p-4">
      <p className="font-medium">{t("yourOrder")}</p>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 text-sm">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-ink/5">
              {item.images[0] && (
                <Image
                  src={imageUrl(item.images[0])}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate">{item.name}</p>
              <p className="text-ink/50">{t("quantity", { count: item.quantity })}</p>
            </div>
            <p className="shrink-0 font-medium">
              {formatUsd(Number(item.finalPriceUsd) * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-t border-ink/10 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/60">{tCartSummary("estimatedSubtotal")}</span>
          <span>{formatUsd(subtotalUsd)}</span>
        </div>
        {coupon && (
          <div className="flex justify-between">
            <span className="text-ink/60">{t("couponPrefix", { code: coupon.code })}</span>
            <span>-{formatUsd(discountUsd)}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between text-base font-semibold">
          <span>{t("estimatedTotal")}</span>
          <span>{formatUsd(totalUsd)}</span>
        </div>
        <div className="flex justify-between text-xs text-ink/50">
          <span>{t("inPesos")}</span>
          <span>{formatArs(totalArs)}</span>
        </div>
      </div>
    </div>
  );
}
