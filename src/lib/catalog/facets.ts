import "server-only";
import { apiFetch } from "@/lib/api/client";
import type { Brand, Category } from "@/types/catalog";

const CATALOG_REVALIDATE_SECONDS = 3600;

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });
}

export async function getBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>("/brands", {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });
}
