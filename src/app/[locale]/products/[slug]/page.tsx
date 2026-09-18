import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PriceTag } from "@/components/ui/PriceTag";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { StockAlertButton } from "@/components/product/StockAlertButton";
import { apiFetch, ApiError } from "@/lib/api/client";
import { getDisplayPrice } from "@/lib/utils/productPrice";
import type { Product } from "@/types/product";

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string): Promise<Product> {
  try {
    return await apiFetch<Product>(`/products/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) notFound();
    throw error;
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [product, t, tNav] = await Promise.all([
    getProduct(slug),
    getTranslations("ProductDetail"),
    getTranslations("Nav"),
  ]);
  const price = getDisplayPrice(product);

  return (
    <Container>
      <Breadcrumb
        current={product.name}
        parent={{ label: tNav("products"), href: "/products" }}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-4">
          {product.brand && (
            <p className="text-xs text-ink/50 uppercase">
              {product.brand.name}
            </p>
          )}
          <h1 className="text-3xl font-semibold">{product.name}</h1>
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
              <AddToCartButton productId={product.id} slug={product.slug} />
            ) : (
              <StockAlertButton slug={product.slug} />
            )}
          </div>

          {product.description && (
            <p className="text-ink/80">{product.description}</p>
          )}
        </div>
      </div>
    </Container>
  );
}
