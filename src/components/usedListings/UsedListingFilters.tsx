import { useLocale, useTranslations } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import type { Category } from "@/types/catalog";
import { FacetCheckboxGroup } from "@/components/product/FacetCheckboxGroup";
import type { ProductsSearchParams } from "@/lib/utils/productSearchParams";

export function UsedListingFilters({
  categories,
  current,
  basePath = "/used-listings",
}: {
  categories: Category[];
  current: ProductsSearchParams;
  basePath?: string;
}) {
  const t = useTranslations("UsedListingFilters");
  const locale = useLocale();

  return (
    <aside className="flex flex-col gap-6 lg:pr-6 lg:border-r lg:border-ink/10">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{t("title")}</p>
        {(current.category || current.minPrice || current.maxPrice) && (
          <Link href={basePath} className="text-xs text-ink/60 underline">
            {t("clear")}
          </Link>
        )}
      </div>

      {categories.length > 0 && (
        <>
          <FacetCheckboxGroup
            title={t("category")}
            items={categories}
            paramKey="category"
            current={current}
            basePath={basePath}
          />
          <hr className="border-ink/10" />
        </>
      )}

      <form action={getPathname({ href: basePath, locale })} className="flex flex-col gap-3">
        {current.category && <input type="hidden" name="category" value={current.category} />}
        {current.sort && <input type="hidden" name="sort" value={current.sort} />}
        <p className="text-xs font-medium tracking-wide text-ink/60 uppercase">
          {t("priceRange")}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            min={0}
            defaultValue={current.minPrice}
            placeholder={t("min")}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-ink/40">—</span>
          <input
            type="number"
            name="maxPrice"
            min={0}
            defaultValue={current.maxPrice}
            placeholder={t("max")}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded border border-ink/20 px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
        >
          {t("apply")}
        </button>
      </form>
    </aside>
  );
}
