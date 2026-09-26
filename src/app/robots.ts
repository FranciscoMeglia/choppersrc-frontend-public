import type { MetadataRoute } from "next";
import { env } from "@/config/env";

/**
 * Bloquea todo lo privado/transaccional (cuenta, checkout, auth) — no tiene
 * valor de búsqueda y además está gateado por login, así que un crawler
 * nunca podría indexar el contenido real igual. `/api/` también afuera: no
 * es una página, es el proxy hacia el backend (ver app/api/backend).
 * El resto del sitio queda abierto — mismo criterio que noIndex en
 * lib/seo/metadata.ts, así que si algún día se agrega una página privada
 * nueva hay que sumarla en los dos lados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/account",
        "/account/",
        "/cart",
        "/checkout",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/confirm-email-change",
        // Mismas rutas pero con prefijo de locale (en/pt no usan uno propio
        // para "es", ver routing.ts localePrefix: "as-needed").
        "/en/account",
        "/en/account/",
        "/en/cart",
        "/en/checkout",
        "/en/login",
        "/en/register",
        "/en/forgot-password",
        "/en/reset-password",
        "/en/verify-email",
        "/en/confirm-email-change",
        "/pt/account",
        "/pt/account/",
        "/pt/cart",
        "/pt/checkout",
        "/pt/login",
        "/pt/register",
        "/pt/forgot-password",
        "/pt/reset-password",
        "/pt/verify-email",
        "/pt/confirm-email-change",
      ],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
