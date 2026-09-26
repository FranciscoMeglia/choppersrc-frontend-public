import "server-only";
import { apiFetch } from "@/lib/api/client";
import type { Brand, Category, CategoryGroup, ProductModel } from "@/types/catalog";

const CATALOG_REVALIDATE_SECONDS = 0;

export async function getCategories(): Promise<Category[]> {
  try {
    return await apiFetch<Category[]>("/categories", {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
  } catch (err) {
    console.error("getCategories: falling back to empty list", err);
    return [];
  }
}

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  try {
    return await apiFetch<CategoryGroup[]>("/category-groups", {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
  } catch (err) {
    console.error("getCategoryGroups: falling back to empty list", err);
    return [];
  }
}

export async function getBrands(params?: { category?: string; group?: string }): Promise<Brand[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.group) qs.set("group", params.group);
  const query = qs.toString();
  try {
    return await apiFetch<Brand[]>(`/brands${query ? `?${query}` : ""}`, {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
  } catch (err) {
    console.error("getBrands: falling back to empty list", err);
    return [];
  }
}

export async function getProductModelsFor(params: {
  category?: string;
  group?: string;
}): Promise<ProductModel[]> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("forCategory", params.category);
  if (params.group) qs.set("forGroup", params.group);
  try {
    return await apiFetch<ProductModel[]>(`/product-models?${qs.toString()}`, {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
  } catch (err) {
    console.error("getProductModelsFor: falling back to empty list", err);
    return [];
  }
}
