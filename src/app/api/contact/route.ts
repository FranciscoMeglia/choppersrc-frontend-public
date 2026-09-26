import { NextResponse } from "next/server";
import { env, internalApiHeaders } from "@/config/env";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

export async function POST(request: Request) {
  const payload = await request.json();

  const backendRes = await fetch(`${env.apiBaseUrl}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...internalApiHeaders() },
    body: JSON.stringify(payload),
  });
  const body = (await backendRes.json()) as ApiSuccessEnvelope<null> | ApiErrorEnvelope;

  return NextResponse.json(body, { status: backendRes.status });
}
