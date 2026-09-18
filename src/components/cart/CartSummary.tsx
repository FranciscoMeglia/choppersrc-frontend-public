import { useTranslations } from "next-intl";
import { PriceTag } from "@/components/ui/PriceTag";

export function CartSummary({
  subtotalUsd,
  subtotalArs,
}: {
  subtotalUsd: string;
  subtotalArs: string;
}) {
  const t = useTranslations("CartSummary");

  return (
    <div className="rounded border border-ink/10 p-4">
      <p className="text-sm text-ink/60">{t("estimatedSubtotal")}</p>
      <PriceTag usd={subtotalUsd} ars={subtotalArs} />
    </div>
  );
}
