import { NextResponse } from "next/server";
import { env, internalApiHeaders } from "@/config/env";
import { setSessionCookies } from "@/lib/auth/cookies";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthSession } from "@/types/auth";

export async function POST(request: Request) {
  const payload = await request.json();

  const backendRes = await fetch(`${env.apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...internalApiHeaders() },
    body: JSON.stringify(payload),
  });
  const body = (await backendRes.json()) as
    | ApiSuccessEnvelope<AuthSession>
    | ApiErrorEnvelope;

  if (!body.success) {
    return NextResponse.json(body, { status: backendRes.status });
  }

  const { accessToken, refreshToken, user } = body.data;
  await setSessionCookies(accessToken, refreshToken);

  return NextResponse.json({ ...body, data: { user } });
}
