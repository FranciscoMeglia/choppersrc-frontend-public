const isServer = typeof window === "undefined";

export const env = {
  apiBaseUrl:
    (isServer && process.env.API_BASE_URL) ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:3000/api",
  apiOrigin: process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
};
