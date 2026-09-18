import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/auth/cookies";
import { refreshTokens } from "@/lib/auth/refreshTokens";
import { sendError, sendSuccess } from "@/lib/api/envelope";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json(sendError("No hay sesión activa", 401), {
      status: 401,
    });
  }

  const refreshed = await refreshTokens(refreshToken);
  if (!refreshed) {
    await clearSessionCookies();
    return NextResponse.json(
      sendError("La sesión venció, iniciá sesión de nuevo", 401),
      { status: 401 },
    );
  }

  await setSessionCookies(refreshed.accessToken, refreshed.refreshToken);
  return NextResponse.json(sendSuccess(null, "Sesión renovada"));
}
