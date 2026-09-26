import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { env } from "@/config/env";
import { site } from "@/config/site";

/**
 * Arma el bloque `alternates` (canonical + hreflang) de una página a partir
 * de un único `href` "neutro" (sin locale, como espera `getPathname` — ver
 * i18n/navigation.ts) — recorre `routing.locales` para las versiones
 * alternativas y usa el locale actual para el canonical. `x-default` apunta
 * siempre a la versión en el locale por default (es, sin prefijo), como
 * recomienda Google para el idioma "de fallback".
 */
function buildAlternates(
  locale: AppLocale,
  href: Parameters<typeof getPathname>[0]["href"],
) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${env.siteUrl}${getPathname({ href, locale: l })}`;
  }
  languages["x-default"] = `${env.siteUrl}${getPathname({ href, locale: routing.defaultLocale })}`;

  return {
    canonical: `${env.siteUrl}${getPathname({ href, locale })}`,
    languages,
  };
}

/**
 * Helper compartido por (casi) todas las páginas para no repetir el mismo
 * armado de title/description/OG/Twitter/canonical/hreflang en cada
 * `generateMetadata` — ver docs/SEO.md. `href` es el mismo objeto/string
 * "neutro" que recibiría `<Link>` de `@/i18n/navigation` (ej. "/products" o
 * `{ pathname: "/products/[slug]", params: { slug } }`).
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  image,
  noIndex = false,
  type = "website",
}: {
  locale: AppLocale;
  href: Parameters<typeof getPathname>[0]["href"];
  title: string;
  description: string;
  /** URL absoluta de la imagen para OG/Twitter — si no se pasa, usa el banner por default (ver layout raíz). */
  image?: string;
  /** Páginas privadas/transaccionales (cuenta, checkout, auth) — nunca deben indexarse. */
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const alternates = buildAlternates(locale, href);
  // No sólo el caso exacto "ChoppersRC" (home) — cualquier título que ya
  // incluya la marca (ej. el propio título SEO de la home, "ChoppersRC —
  // Helicópteros RC...") no debe llevarla pegada dos veces en OG/Twitter.
  const includesSiteName = title.includes(site.name);
  const fullTitle = includesSiteName ? title : `${title} | ${site.name}`;

  return {
    // El root layout define un `title.template` ("%s | ChoppersRC") que
    // envolvería incluso al título de la home ("ChoppersRC | ChoppersRC")
    // si no se lo bypassea con `absolute` acá.
    title: includesSiteName ? { absolute: title } : title,
    description,
    alternates,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale,
      type,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
