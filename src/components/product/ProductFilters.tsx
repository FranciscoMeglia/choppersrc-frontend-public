import { useLocale, useTranslations } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import type { Brand, Category, ProductModel } from "@/types/catalog";
import { FacetCheckboxGroup } from "./FacetCheckboxGroup";
import { ModelFacetSearch } from "./ModelFacetSearch";
import type { ProductsSearchParams } from "@/lib/utils/productSearchParams";

export function ProductFilters({
  brands,
  current,
  basePath = "/products",
  categories,
  models,
}: {
  brands: Brand[];
  current: ProductsSearchParams;
  basePath?: string;
  categories?: Category[];
  models?: ProductModel[];
}) {
  const t = useTranslations("ProductFilters");
  const locale = useLocale();

  const stockOptions = [
    { name: t("inStock"), slug: "in" },
    { name: t("outOfStock"), slug: "out" },
  ];

  return (
    <aside className="flex flex-col gap-6 lg:pr-6 lg:border-r lg:border-ink/10">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{t("title")}</p>
        {(current.q ||
          current.category ||
          current.model ||
          current.brand ||
          current.minPrice ||
          current.maxPrice ||
          current.stock) && (
          <Link href={basePath} className="text-xs text-ink/60 underline">
            {t("clear")}
          </Link>
        )}
      </div>

      {models && models.length > 0 && (
        <>
          <ModelFacetSearch
            title={t("model")}
            models={models}
            current={current}
            basePath={basePath}
          />
          <hr className="border-ink/10" />
        </>
      )}
      <FacetCheckboxGroup
        title={t("stock")}
        items={stockOptions}
        paramKey="stock"
        current={current}
        basePath={basePath}
      />
      <hr className="border-ink/10" />
      {categories && categories.length > 0 && (
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
      <FacetCheckboxGroup
        title={t("brand")}
        items={brands}
        paramKey="brand"
        current={current}
        basePath={basePath}
      />
      <hr className="border-ink/10" />

      <form
        action={getPathname({ href: basePath, locale })}
        className="flex flex-col gap-3"
      >
        {current.q && <input type="hidden" name="q" value={current.q} />}
        {current.category && (
          <input type="hidden" name="category" value={current.category} />
        )}
        {current.model && (
          <input type="hidden" name="model" value={current.model} />
        )}
        {current.brand && (
          <input type="hidden" name="brand" value={current.brand} />
        )}
        {current.sort && <input type="hidden" name="sort" value={current.sort} />}
        {current.stock && <input type="hidden" name="stock" value={current.stock} />}
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
