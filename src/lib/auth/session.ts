import "server-only";
import { env } from "@/config/env";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import { getAccessToken } from "./cookies";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const res = await fetch(`${env.apiBaseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const body = (await res.json()) as
    | ApiSuccessEnvelope<AuthUser>
    | ApiErrorEnvelope;
  return body.success ? body.data : null;
}
