export type BlogCategory =
  | "NOVEDADES"
  | "INTERES_GENERAL"
  | "EVENTOS"
  | "COMPETENCIAS"
  | "TUTORIALES";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  images: string[];
  category: BlogCategory;
  publishedAt: string | null;
}
