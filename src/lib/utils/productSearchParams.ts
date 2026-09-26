export interface ProductsSearchParams {
  q?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  stock?: string;
  category?: string;
  model?: string;
}

const KEYS: (keyof ProductsSearchParams)[] = [
  "q",
  "brand",
  "minPrice",
  "maxPrice",
  "sort",
  "stock",
  "category",
  "model",
];

export function buildProductsHref(
  current: ProductsSearchParams,
  patch: ProductsSearchParams,
  basePath = "/products",
): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();
  for (const key of KEYS) {
    if (merged[key]) params.set(key, merged[key]!);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
