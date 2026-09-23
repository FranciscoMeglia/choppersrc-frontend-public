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
    // Merge over EMPTY_SETTINGS even on success: a setting the admin
    // hasn't configured yet comes back missing/null from the API despite
    // the type saying `string`, and every field here renders unguarded in
    // the footer of every page (e.g. Footer.tsx calling
    // buildWhatsAppUrl(settings.contactPhone) -> phone.replace(...)).
    const data = await apiFetch<Partial<PublicSettings>>("/settings", {
      next: { revalidate: CONTACT_SETTINGS_REVALIDATE_SECONDS },
    });
    return { ...EMPTY_SETTINGS, ...data };
  } catch (err) {
    console.error("getPublicSettings: falling back to empty settings", err);
    return EMPTY_SETTINGS;
  }
}
