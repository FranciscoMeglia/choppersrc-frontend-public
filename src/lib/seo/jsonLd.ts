import { env } from "@/config/env";
import { site } from "@/config/site";
import { imageUrl } from "@/lib/utils/imageUrl";
import type { Product } from "@/types/product";
import type { UsedListing } from "@/types/usedListing";
import type { BlogPost } from "@/types/blogPost";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdObject = Record<string, any>;

function absoluteImage(path?: string | null): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : imageUrl(path);
}

/** Se repite en cada página (Organization) — Google usa esto para el panel
 * de conocimiento y para asociar el logo/redes sociales a las demás
 * entidades (Product, BlogPosting, etc. lo referencian por `@id`). */
export function organizationJsonLd(settings?: {
  contactPhone?: string;
  contactEmail?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
}): JsonLdObject {
  const sameAs = [settings?.socialFacebook, settings?.socialInstagram, settings?.socialYoutube].filter(
    (url): url is string => Boolean(url) && url !== "Completar en Ajustes",
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${env.siteUrl}/#organization`,
    name: site.name,
    url: env.siteUrl,
    logo: `${env.siteUrl}/icon.png`,
    ...(settings?.contactPhone
      ? { contactPoint: [{ "@type": "ContactPoint", telephone: settings.contactPhone, contactType: "sales" }] }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite + SearchAction: lo que habilita el "sitelinks search box" de
 * Google (el buscador debajo del resultado del sitio) — apunta a
 * `/products?q={search_term_string}`, que es como ya arma la URL
 * SearchInput.tsx. Va sólo en la home. */
export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${env.siteUrl}/#website`,
    url: env.siteUrl,
    name: site.name,
    publisher: { "@id": `${env.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${env.siteUrl}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${env.siteUrl}${item.path}`,
    })),
  };
}

/** Product + Offer — precio en USD (el catálogo se carga en esa moneda, ver
 * ProductDetail) con el final ya aplicado (oferta activa si hay). Google
 * exige `availability`/`priceValidUntil` razonables para habilitar rich
 * results de precio; sin stock se manda OutOfStock en vez de InStock. */
export function productJsonLd(product: Product, url: string): JsonLdObject {
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]+>/g, "").slice(0, 500) || undefined,
    sku: product.sku || undefined,
    image: product.images.map((p) => absoluteImage(p)).filter(Boolean),
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: Number(product.finalPriceUsd).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
      itemCondition:
        product.condition === "USED" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
    },
  };
}

/** Igual que productJsonLd pero para el marketplace de Usados — precio en
 * ARS (cada vendedor lo fija así, no hay cotización de por medio, ver
 * UsedListing.price) y siempre condición usada. No lleva `Offer.seller`
 * formal porque ChoppersRC no es el vendedor ni participa de la venta (ver
 * UsedListingContactCard) — declararlo como si vendiera la empresa sería
 * engañoso para Google. */
export function usedListingJsonLd(listing: UsedListing, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description.slice(0, 500),
    image: listing.images.map((p) => absoluteImage(p)).filter(Boolean),
    category: listing.category?.name,
    brand: listing.brand ? { "@type": "Brand", name: listing.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ARS",
      price: Number(listing.price).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      areaServed: listing.city,
    },
  };
}

export function blogPostingJsonLd(post: BlogPost, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.images.map((p) => absoluteImage(p)).filter(Boolean),
    // El tipo BlogPost del frontend no trae updatedAt — sólo `publishedAt`,
    // que alcanza para datePublished (dateModified queda afuera antes que
    // mandar una fecha inventada).
    datePublished: post.publishedAt || undefined,
    author: { "@id": `${env.siteUrl}/#organization` },
    publisher: { "@id": `${env.siteUrl}/#organization` },
    mainEntityOfPage: url,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** ItemList — para listados (productos/usados/blog) donde no hay una sola
 * entidad protagonista sino una colección; ayuda a Google a entender la
 * página como un índice, no como el ítem #1 de la lista. */
export function itemListJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${env.siteUrl}${item.path}`,
    })),
  };
}
