import "server-only";
import { apiFetch } from "@/lib/api/client";
import type { PublicSettings } from "@/types/settings";

const CONTACT_SETTINGS_REVALIDATE_SECONDS = 3600;

// Rendered in the footer of every page, so a backend hiccup here (or the
// backend being unreachable at build time, e.g. `next build` running
// outside the runtime network) shouldn't take the whole site down with it —
// fall back to blank contact info instead of throwing.
const EMPTY_SETTINGS: PublicSettings = {
  shippingDisclaimer: "",
  bankTransferBank: "",
  bankTransferHolder: "",
  bankTransferCbu: "",
  bankTransferAlias: "",
  contactAddress: "",
  contactPhone: "",
  contactEmail: "",
  socialFacebook: "",
  socialInstagram: "",
  socialYoutube: "",
};

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    return await apiFetch<PublicSettings>("/settings", {
      next: { revalidate: CONTACT_SETTINGS_REVALIDATE_SECONDS },
    });
  } catch (err) {
    console.error("getPublicSettings: falling back to empty settings", err);
    return EMPTY_SETTINGS;
  }
}
