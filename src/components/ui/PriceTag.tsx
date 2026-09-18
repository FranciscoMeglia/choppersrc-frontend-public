import { useTranslations } from "next-intl";
import { formatArs, formatUsd } from "@/lib/utils/formatPrice";

export function PriceTag({
  usd,
  ars,
  showEstimate = true,
}: {
  usd: string;
  ars: string;
  showEstimate?: boolean;
}) {
  const t = useTranslations("PriceTag");

  return (
    <div>
      <p>{formatUsd(usd)}</p>
      {showEstimate && (
        <p className="text-xs text-ink/50">
          {t("estimatedArs", { value: formatArs(ars) })}
        </p>
      )}
    </div>
  );
}
