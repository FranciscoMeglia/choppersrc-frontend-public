import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { apiFetchPage } from "@/lib/api/client";
import { getBrands, getCategories } from "@/lib/catalog/facets";
import type { ProductsSearchParams } from "@/lib/utils/productSearchParams";
import type { Product } from "@/types/product";

const PAGE_SIZE = 30;

type Props = { searchParams: Promise<ProductsSearchParams> };

export default async function ProductsPage({ searchParams }: Props) {
  const current = await searchParams;
  const [t, tNav] = await Promise.all([
    getTranslations("ProductsPage"),
    getTranslations("Nav"),
  ]);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (current.q) query.set("q", current.q);
  if (current.category) query.set("category", current.category);
  if (current.brand) query.set("brand", current.brand);
  if (current.minPrice) query.set("minPrice", current.minPrice);
  if (current.maxPrice) query.set("maxPrice", current.maxPrice);
  if (current.sort) query.set("sort", current.sort);
  if (current.stock) query.set("stock", current.stock);

  const [{ data: products, pagination }, categories, brands] =
    await Promise.all([
      apiFetchPage<Product[]>(`/products?${query.toString()}`),
      getCategories(),
      getBrands(),
    ]);

  return (
    <Container>
      <Breadcrumb current={tNav("products")} />
      <Reveal>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
          {tNav("products")}
        </h1>
        {current.q && (
          <p className="mt-1 text-sm text-ink/60">
            {t("searchResultsFor", { query: current.q })}
          </p>
        )}
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters
          categories={categories}
          brands={brands}
          current={current}
        />

        <div className="flex flex-col gap-6">
          <SortBar count={pagination.total} current={current} />
          <ProductGrid
            key={query.toString()}
            initialProducts={products}
            initialPagination={pagination}
            queryString={query.toString()}
          />
        </div>
      </div>
    </Container>
  );
}
