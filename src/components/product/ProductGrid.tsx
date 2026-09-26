"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard, type ProductListContext } from "./ProductCard";
import { apiFetchPage } from "@/lib/api/client";
import type { Pagination } from "@/types/api";
import type { Product } from "@/types/product";

const PAGE_SIZE = 30;

export function ProductGrid({
  initialProducts,
  initialPagination,
  queryString,
  context,
}: {
  initialProducts: Product[];
  initialPagination: Pagination;
  queryString: string;
  /** Contexto de grupo/categoría del listado actual — ver ProductCard. */
  context?: ProductListContext;
}) {
  const t = useTranslations("ProductGrid");
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPagination.page);
  const [total, setTotal] = useState(initialPagination.total);
  const [loading, setLoading] = useState(false);

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-ink/60">
        {t("noResults")}
      </p>
    );
  }

  async function handleLoadMore() {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const { data, pagination } = await apiFetchPage<Product[]>(
        `/products?${queryString}&page=${nextPage}`,
      );
      setProducts((prev) => [...prev, ...data]);
      setPage(pagination.page);
      setTotal(pagination.total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal
            key={product.slug}
            delay={Math.min(i % PAGE_SIZE, 5) * 0.06}
          >
            <ProductCard product={product} context={context} />
          </Reveal>
        ))}
      </div>

      {products.length < total && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleLoadMore} disabled={loading}>
            {loading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
