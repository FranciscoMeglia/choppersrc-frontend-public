const isServer = typeof window === "undefined";

export const env = {
  isServer,
  apiBaseUrl:
    (isServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "http://localhost:3000/api",
  apiOrigin: process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  internalApiKey: isServer ? process.env.INTERNAL_API_KEY || "" : "",
};

export function internalApiHeaders(): Record<string, string> {
  return env.isServer && env.internalApiKey
    ? { "X-Internal-Key": env.internalApiKey, "X-Channel": "public" }
    : {};
}
