import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Manifest básico — no es una PWA instalable de verdad (no hay service
 * worker), pero completa el ícono/tema para "agregar a inicio" en mobile y
 * es lo que Lighthouse/Search Console esperan encontrar junto al favicon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: "Kits, repuestos y accesorios para helicópteros RC.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
