export interface ProductsSearchParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  stock?: string;
}

const KEYS: (keyof ProductsSearchParams)[] = [
  "q",
  "category",
  "brand",
  "minPrice",
  "maxPrice",
  "sort",
  "stock",
];

export function buildProductsHref(
  current: ProductsSearchParams,
  patch: ProductsSearchParams,
): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();
  for (const key of KEYS) {
    if (merged[key]) params.set(key, merged[key]!);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}
