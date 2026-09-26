import { NextResponse } from "next/server";
import { env, internalApiHeaders } from "@/config/env";
import { clearSessionCookies, getRefreshToken } from "@/lib/auth/cookies";
import { sendSuccess } from "@/lib/api/envelope";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await fetch(`${env.apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...internalApiHeaders() },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {
    });
  }

  await clearSessionCookies();
  return NextResponse.json(sendSuccess(null, "Sesión cerrada"));
}
