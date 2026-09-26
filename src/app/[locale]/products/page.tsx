import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { apiFetchPage } from "@/lib/api/client";
import { getBrands } from "@/lib/catalog/facets";
import { buildProductsHref, type ProductsSearchParams } from "@/lib/utils/productSearchParams";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/types/product";

const PAGE_SIZE = 30;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ProductsSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  // Canonical siempre a /products "limpio": los filtros/orden en query string
  // son variantes de la misma página, no contenido distinto que indexar aparte.
  return buildMetadata({
    locale: locale as AppLocale,
    href: "/products",
    title: t("products.title"),
    description: t("products.description"),
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, ...current } = await searchParams;

  if (category) {
    redirect(buildProductsHref(current, {}, `/products/category/${category}`));
  }

  const [t, tNav] = await Promise.all([
    getTranslations("ProductsPage"),
    getTranslations("Nav"),
  ]);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (current.q) query.set("q", current.q);
  if (current.brand) query.set("brand", current.brand);
  if (current.minPrice) query.set("minPrice", current.minPrice);
  if (current.maxPrice) query.set("maxPrice", current.maxPrice);
  if (current.sort) query.set("sort", current.sort);
  if (current.stock) query.set("stock", current.stock);

  const [{ data: products, pagination }, brands] = await Promise.all([
    apiFetchPage<Product[]>(`/products?${query.toString()}`).catch((err) => {
      console.error("ProductsPage: falling back to empty results", err);
      return {
        data: [] as Product[],
        pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 },
      };
    }),
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
        <ProductFilters brands={brands} current={current} />

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
