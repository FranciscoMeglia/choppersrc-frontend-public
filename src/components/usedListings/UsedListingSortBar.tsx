import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildProductsHref, type ProductsSearchParams } from "@/lib/utils/productSearchParams";

export function UsedListingSortBar({
  count,
  current,
  basePath = "/used-listings",
}: {
  count: number;
  current: ProductsSearchParams;
  basePath?: string;
}) {
  const t = useTranslations("UsedListingSortBar");

  const sortOptions: { value?: string; label: string; icon?: LucideIcon }[] = [
    { value: undefined, label: t("relevance") },
    { value: "price_asc", label: t("price"), icon: ArrowUp },
    { value: "price_desc", label: t("price"), icon: ArrowDown },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
      <p className="text-sm text-ink/60">{t("count", { count })}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs text-ink/40 uppercase">{t("sortLabel")}</span>
        {sortOptions.map((option) => {
          const isActive = (current.sort || undefined) === option.value;
          const Icon = option.icon;
          return (
            <Link
              key={option.value ?? "relevancia"}
              href={buildProductsHref(current, { sort: option.value }, basePath)}
              className={
                isActive
                  ? "flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-white"
                  : "flex items-center gap-1 rounded border border-ink/20 px-3 py-1.5 hover:border-primary hover:text-primary"
              }
            >
              {option.label}
              {Icon && <Icon className="size-3.5" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
