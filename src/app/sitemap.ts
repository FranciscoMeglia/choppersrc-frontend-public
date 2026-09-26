import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { apiFetch, apiFetchPage } from "@/lib/api/client";
import type { Product } from "@/types/product";
import type { Category, CategoryGroup } from "@/types/catalog";
import type { BlogPost } from "@/types/blogPost";
import type { UsedListing } from "@/types/usedListing";

// Techo de páginas a recorrer por recurso — no hay tantos productos/posts
// como para necesitar más, y evita un loop sin fin si algo en la paginación
// de la API falla y siempre devuelve `total` mal.
const MAX_PAGES = 20;
const PAGE_SIZE = 100;

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Arma una entrada con sus hreflang (`alternates.languages`) para los tres
 * locales — mismo criterio que `buildMetadata` en lib/seo/metadata.ts, pero
 * sin depender de un request en curso (`sitemap.ts` corre fuera de React). */
function localizedEntry(
  pathname: string,
  opts: Pick<SitemapEntry, "priority" | "changeFrequency" | "lastModified"> = {},
): SitemapEntry {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${env.siteUrl}${getPathname({ href: pathname, locale })}`;
  }
  return {
    url: `${env.siteUrl}${getPathname({ href: pathname, locale: routing.defaultLocale })}`,
    alternates: { languages },
    ...opts,
  };
}

/** Junta todas las páginas de un endpoint paginado (`{data, meta.pagination}`)
 * hasta agotarlo o llegar a MAX_PAGES — mismo shape que apiFetchPage. */
async function fetchAllPages<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const sep = path.includes("?") ? "&" : "?";
    let result;
    try {
      result = await apiFetchPage<T[]>(`${path}${sep}limit=${PAGE_SIZE}&page=${page}`);
    } catch (err) {
      console.error(`sitemap: falling back, couldn't fetch "${path}" page ${page}`, err);
      break;
    }
    items.push(...result.data);
    if (page >= result.pagination.totalPages) break;
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, groups, posts, listings] = await Promise.all([
    fetchAllPages<Product>("/products"),
    apiFetch<Category[]>("/categories").catch(() => []),
    apiFetch<CategoryGroup[]>("/category-groups").catch(() => []),
    fetchAllPages<BlogPost>("/blog"),
    fetchAllPages<UsedListing>("/used-listings"),
  ]);

  const staticPages: SitemapEntry[] = [
    localizedEntry("/", { priority: 1, changeFrequency: "daily" }),
    localizedEntry("/products", { priority: 0.9, changeFrequency: "daily" }),
    localizedEntry("/used-listings", { priority: 0.6, changeFrequency: "daily" }),
    localizedEntry("/blog", { priority: 0.6, changeFrequency: "weekly" }),
    localizedEntry("/about", { priority: 0.4, changeFrequency: "monthly" }),
    localizedEntry("/contact", { priority: 0.4, changeFrequency: "monthly" }),
    localizedEntry("/faq", { priority: 0.3, changeFrequency: "monthly" }),
    localizedEntry("/terms", { priority: 0.1, changeFrequency: "yearly" }),
    localizedEntry("/privacy", { priority: 0.1, changeFrequency: "yearly" }),
  ];

  // El tipo Product del frontend no trae updatedAt/createdAt, así que no
  // hay lastModified real para mandar acá (mejor omitirlo que inventarlo).
  const productEntries = products.map((p) =>
    localizedEntry(`/products/${p.slug}`, { priority: 0.7, changeFrequency: "weekly" }),
  );

  const categoryEntries = categories.map((c) =>
    localizedEntry(`/products/category/${c.slug}`, { priority: 0.6, changeFrequency: "daily" }),
  );

  const groupEntries = groups.map((g) =>
    localizedEntry(`/products/group/${g.slug}`, { priority: 0.6, changeFrequency: "daily" }),
  );

  const postEntries = posts.map((post) =>
    localizedEntry(`/blog/${post.slug}`, {
      priority: 0.5,
      changeFrequency: "monthly",
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    }),
  );

  // Sólo llegan acá las APPROVED (el endpoint público de /used-listings ya
  // filtra por eso, ver used-listings.service.js#listPublicListings) —
  // prioridad baja porque son publicaciones de terceros, efímeras (se
  // pueden vender/dar de baja en cualquier momento).
  const listingEntries = listings.map((listing) =>
    localizedEntry(`/used-listings/${listing.id}`, {
      priority: 0.3,
      changeFrequency: "weekly",
      lastModified: new Date(listing.updatedAt),
    }),
  );

  return [
    ...staticPages,
    ...productEntries,
    ...categoryEntries,
    ...groupEntries,
    ...postEntries,
    ...listingEntries,
  ];
}
