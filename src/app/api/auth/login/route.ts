import { NextResponse } from "next/server";
import { env, internalApiHeaders } from "@/config/env";
import { setSessionCookies } from "@/lib/auth/cookies";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthSession, TwoFactorChallenge } from "@/types/auth";

export async function POST(request: Request) {
  const credentials = await request.json();

  const backendRes = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...internalApiHeaders() },
    body: JSON.stringify(credentials),
  });
  const body = (await backendRes.json()) as
    | ApiSuccessEnvelope<AuthSession | TwoFactorChallenge>
    | ApiErrorEnvelope;

  if (!body.success) {
    return NextResponse.json(body, { status: backendRes.status });
  }

  if ("requires2fa" in body.data) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 403,
        message:
          "Esta cuenta tiene verificación en dos pasos: ingresá desde el panel de administración.",
        errors: null,
        timestamp: new Date().toISOString(),
      },
      { status: 403 },
    );
  }

  const { accessToken, refreshToken, user } = body.data;
  await setSessionCookies(accessToken, refreshToken);

  return NextResponse.json({ ...body, data: { user } });
}
