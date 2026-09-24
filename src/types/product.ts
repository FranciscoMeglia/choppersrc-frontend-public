import type { Brand, Category, ExchangeRate, Supplier } from "./catalog";

export type DiscountType = "PERCENTAGE" | "FIXED";
export type ProductCondition = "NEW" | "USED";

export interface ProductDiscount {
  id: number;
  name: string;
  type: DiscountType;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceUsd: string;
  finalPriceUsd: string;
  priceArs: string;
  finalPriceArs: string;
  sku: string | null;
  condition: ProductCondition;
  discount: ProductDiscount | null;
  exchangeRate: ExchangeRate;
  stock: number;
  images: string[];
  category: Category | null;
  additionalCategories: Category[];
  brand: Brand | null;
  supplier: Supplier;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  supplier?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "name_asc";
}
