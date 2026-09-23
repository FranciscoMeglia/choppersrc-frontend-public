const isServer = typeof window === "undefined";

export const env = {
  isServer,
  apiBaseUrl:
    (isServer && process.env.API_BASE_URL) ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
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
