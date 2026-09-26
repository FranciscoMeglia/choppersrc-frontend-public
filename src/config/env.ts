const isServer = typeof window === "undefined";

export const env = {
  isServer,
  apiBaseUrl:
    (isServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "http://localhost:3000/api",
  apiOrigin: process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000",
  // Origen público del sitio en sí (no de la API) — para metadataBase,
  // canonical/hreflang, sitemap.xml y JSON-LD (ver docs/SEO.md). Mismo
  // dominio que PUBLIC_ORIGIN usa el docker-compose para armar
  // NEXT_PUBLIC_API_ORIGIN en build; se repite acá porque ese var no queda
  // expuesto al runtime del cliente con ese nombre.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  internalApiKey: isServer ? process.env.INTERNAL_API_KEY || "" : "",
};

export function internalApiHeaders(): Record<string, string> {
  return env.isServer && env.internalApiKey
    ? { "X-Internal-Key": env.internalApiKey, "X-Channel": "public" }
    : {};
}
