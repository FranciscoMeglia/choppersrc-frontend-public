"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatUsd } from "@/lib/utils/formatPrice";
import type { StockAlert } from "@/types/stockAlert";

export function StockAlertRow({ alert }: { alert: StockAlert }) {
  const t = useTranslations("StockAlertRow");
  const [removed, setRemoved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (removed) return null;

  async function handleRemove() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/backend/products/${alert.product.slug}/stock-alert`,
        { method: "DELETE" },
      );
      if (res.ok) setRemoved(true);
    } finally {
      setLoading(false);
    }
  }

  const cover = alert.product.images[0];

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-ink/10 bg-ink/5">
        {cover && (
          <Image
            src={imageUrl(cover)}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${alert.product.slug}`}
          className="font-medium hover:text-primary hover:underline"
        >
          {alert.product.name}
        </Link>
        <p className="text-sm text-ink/60">
          {alert.product.stock > 0
            ? t("inStock", { count: alert.product.stock })
            : t("outOfStock")}{" "}
          · {formatUsd(alert.product.priceUsd)}
        </p>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="shrink-0 text-sm text-ink/60 hover:text-primary"
      >
        {loading ? t("removing") : t("remove")}
      </button>
    </div>
  );
}
