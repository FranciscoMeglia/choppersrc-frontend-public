import "server-only";
import { apiFetch } from "@/lib/api/client";
import type { PublicSettings } from "@/types/settings";

const CONTACT_SETTINGS_REVALIDATE_SECONDS = 3600;

export async function getPublicSettings(): Promise<PublicSettings> {
  return apiFetch<PublicSettings>("/settings", {
    next: { revalidate: CONTACT_SETTINGS_REVALIDATE_SECONDS },
  });
}
