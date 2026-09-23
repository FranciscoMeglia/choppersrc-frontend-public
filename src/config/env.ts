const isServer = typeof window === "undefined";

export const env = {
  isServer,
  // NEXT_PUBLIC_API_BASE_URL is meant for the browser and is often a
  // relative path (e.g. "/api", proxied by nginx) — never usable as a
  // server-side fetch base, so it's deliberately excluded from this
  // fallback chain. Without API_BASE_URL, server fetches go to localhost
  // instead of silently hanging on an unparseable relative URL.
  apiBaseUrl:
    (isServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "http://localhost:3000/api",
  apiOrigin: process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  // Solo se usa server-side: los fetches SSR pegan directo a
  // choppersrc_api salteando el nginx del VPS (que es quien inyecta este
  // header en las requests del browser), así que hay que mandarlo acá
  // también o el backend los rechaza con 403 en producción. Al no tener
  // prefijo NEXT_PUBLIC_, Next no lo incluye en el bundle del cliente.
  internalApiKey: isServer ? process.env.INTERNAL_API_KEY || "" : "",
};

// Every server-side fetch straight to the backend (client.ts's apiFetch,
// plus the /api/auth/* route handlers and the /api/backend/[...path] proxy,
// which all call fetch() directly instead of going through apiFetch) needs
// this or the backend's requireInternalKey middleware 403s it once
// INTERNAL_API_KEY is set in production.
export function internalApiHeaders(): Record<string, string> {
  return env.isServer && env.internalApiKey
    ? { "X-Internal-Key": env.internalApiKey, "X-Channel": "public" }
    : {};
}
