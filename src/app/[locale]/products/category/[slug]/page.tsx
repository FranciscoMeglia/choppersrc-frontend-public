import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiFetchPage } from "@/lib/api/client";
import { getBrands, getCategories, getProductModelsFor } from "@/lib/catalog/facets";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import type { AppLocale } from "@/i18n/routing";
import type { ProductsSearchParams } from "@/lib/utils/productSearchParams";
import type { Product } from "@/types/product";

const PAGE_SIZE = 30;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<ProductsSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const [categories, t] = await Promise.all([
    getCategories(),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  return buildMetadata({
    locale: locale as AppLocale,
    href: `/products/category/${slug}`,
    title: category.name,
    description: t("products.description"),
  });
}

export default async function CategoryProductsPage({ params, searchParams }: Props) {
  const [{ slug }, current] = await Promise.all([params, searchParams]);
  const basePath = `/products/category/${slug}`;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const [t, tNav, brands, models] = await Promise.all([
    getTranslations("ProductsPage"),
    getTranslations("Nav"),
    getBrands({ category: slug }),
    getProductModelsFor({ category: slug }),
  ]);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE), category: slug });
  if (current.q) query.set("q", current.q);
  if (current.model) query.set("model", current.model);
  if (current.brand) query.set("brand", current.brand);
  if (current.minPrice) query.set("minPrice", current.minPrice);
  if (current.maxPrice) query.set("maxPrice", current.maxPrice);
  if (current.sort) query.set("sort", current.sort);
  if (current.stock) query.set("stock", current.stock);

  const { data: products, pagination } = await apiFetchPage<Product[]>(
    `/products?${query.toString()}`,
  );

  const breadcrumbItems = category.group
    ? [
        { name: tNav("products"), path: "/products" },
        { name: category.group.name, path: `/products/group/${category.group.slug}` },
        { name: category.name, path: `/products/category/${category.slug}` },
      ]
    : [
        { name: tNav("products"), path: "/products" },
        { name: category.name, path: `/products/category/${category.slug}` },
      ];

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumb
        current={category.name}
        parents={
          category.group
            ? [
                { label: tNav("products"), href: "/products" },
                { label: category.group.name, href: `/products/group/${category.group.slug}` },
              ]
            : [{ label: tNav("products"), href: "/products" }]
        }
      />
      <Reveal>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
          {category.name}
        </h1>
        {current.q && (
          <p className="mt-1 text-sm text-ink/60">
            {t("searchResultsFor", { query: current.q })}
          </p>
        )}
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters brands={brands} models={models} current={current} basePath={basePath} />

        <div className="flex flex-col gap-6">
          <SortBar count={pagination.total} current={current} basePath={basePath} />
          <ProductGrid
            key={query.toString()}
            initialProducts={products}
            initialPagination={pagination}
            queryString={query.toString()}
            context={{ categorySlug: slug, groupSlug: category.group?.slug }}
          />
        </div>
      </div>
    </Container>
  );
}
