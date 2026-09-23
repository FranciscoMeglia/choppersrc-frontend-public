import { env, internalApiHeaders } from "@/config/env";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { RefreshResponse } from "@/types/auth";

export async function refreshTokens(
  refreshToken: string,
): Promise<RefreshResponse | null> {
  const res = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...internalApiHeaders() },
    body: JSON.stringify({ refreshToken }),
  });
  const body = (await res.json()) as
    | ApiSuccessEnvelope<RefreshResponse>
    | ApiErrorEnvelope;
  return body.success ? body.data : null;
}
