import "server-only";
import { apiFetch } from "@/lib/api/client";
import type { PublicSettings } from "@/types/settings";

const CONTACT_SETTINGS_REVALIDATE_SECONDS = 3600;

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
    const data = await apiFetch<Partial<PublicSettings>>("/settings", {
      next: { revalidate: CONTACT_SETTINGS_REVALIDATE_SECONDS },
    });
    return { ...EMPTY_SETTINGS, ...data };
  } catch (err) {
    console.error("getPublicSettings: falling back to empty settings", err);
    return EMPTY_SETTINGS;
  }
}
