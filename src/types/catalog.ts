
export interface Category {
  id: number;
  name: string;
  slug: string;
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
