
export interface Category {
  id: number;
  name: string;
  slug: string;
  // El público /categories ya lo incluye (ver categories.service.js#CATEGORY_INCLUDE)
  // — se usa para armar la migaja de pan completa (grupo > categoría) en la
  // página de producto cuando se entra desde el listado por categoría.
  group?: { id: number; name: string; slug: string } | null;
}

export interface CategoryGroup {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  categories: Category[];
}

export interface ProductModel {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  websiteUrl: string | null;
  featured: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  code: string;
  isLocal: boolean;
  active: boolean;
}

export interface ExchangeRate {
  rate: string;
  source: string;
  fetchedAt: string;
}
