import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PriceTag } from "@/components/ui/PriceTag";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { StockAlertButton } from "@/components/product/StockAlertButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiFetch, ApiError } from "@/lib/api/client";
import { getDisplayPrice } from "@/lib/utils/productPrice";
import { getCategories, getCategoryGroups } from "@/lib/catalog/facets";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonLd";
import { imageUrl } from "@/lib/utils/imageUrl";
import { env } from "@/config/env";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/types/product";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  // `group`/`category` los agrega ProductCard cuando se llega desde un
  // listado por grupo/categoría (ver ProductCard#productHref) — así la
  // migaja de pan refleja de dónde se entró, sin duplicar la URL canónica
  // del producto (sigue siendo /products/[slug] siempre).
  searchParams: Promise<{ group?: string; category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let product: Product;
  try {
    product = await apiFetch<Product>(`/products/${slug}`);
  } catch {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const plainDescription =
    product.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300) ||
    t("productFallbackDescription", { name: product.name });

  return buildMetadata({
    locale: locale as AppLocale,
    href: `/products/${slug}`,
    title: product.name,
    description: plainDescription,
    image: product.images[0] ? imageUrl(product.images[0]) : undefined,
  });
}

async function getProduct(slug: string): Promise<Product> {
  try {
    return await apiFetch<Product>(`/products/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) notFound();
    throw error;
  }
}

/** Reconstruye la cadena grupo > categoría a partir de los query params de
 * contexto, para la migaja de pan — ver comentario de `Props` arriba. */
async function resolveBreadcrumbParents(
  productsLabel: string,
  context: { group?: string; category?: string },
) {
  const base = { label: productsLabel, href: "/products" };
  if (context.category) {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === context.category);
    if (category) {
      const parents = [base];
      if (category.group) {
        parents.push({ label: category.group.name, href: `/products/group/${category.group.slug}` });
      }
      parents.push({ label: category.name, href: `/products/category/${category.slug}` });
      return parents;
    }
  }
  if (context.group) {
    const groups = await getCategoryGroups();
    const group = groups.find((g) => g.slug === context.group);
    if (group) {
      return [base, { label: group.name, href: `/products/group/${group.slug}` }];
    }
  }
  return [base];
}

export default async function Page({ params, searchParams }: Props) {
  const [{ slug, locale }, context] = await Promise.all([params, searchParams]);
  const [product, t, tNav] = await Promise.all([
    getProduct(slug),
    getTranslations("ProductDetail"),
    getTranslations("Nav"),
  ]);
  const price = getDisplayPrice(product);
  const breadcrumbParents = await resolveBreadcrumbParents(tNav("products"), context);
  const canonicalPath = getPathname({ href: `/products/${slug}`, locale: locale as AppLocale });

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            ...breadcrumbParents.map((p) => ({ name: p.label, path: p.href })),
            { name: product.name, path: canonicalPath },
          ]),
          productJsonLd(product, `${env.siteUrl}${canonicalPath}`),
        ]}
      />
      <Breadcrumb current={product.name} parents={breadcrumbParents} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-4">
          {product.brand && (
            <p className="text-xs text-ink/50 uppercase">
              {product.brand.name}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            {product.condition === "USED" && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                {t("used")}
              </span>
            )}
          </div>
          {product.sku && (
            <p className="text-xs text-ink/40">
              {t("sku")}: {product.sku}
            </p>
          )}
          <div className="text-xl">
            <PriceTag usd={price.usd} ars={price.ars} />
          </div>

          <p className="text-sm text-ink/60">
            {product.stock > 0
              ? t("inStock", { count: product.stock })
              : t("outOfStock")}
          </p>
          <div className="mt-2">
            {product.stock > 0 ? (
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                stock={product.stock}
              />
            ) : (
              <StockAlertButton slug={product.slug} />
            )}
          </div>

          {product.description && (
            <div
              className="rich-text text-ink/80"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
