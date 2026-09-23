import { NextResponse, type NextRequest } from "next/server";
import { env, internalApiHeaders } from "@/config/env";
import { getAccessToken } from "@/lib/auth/cookies";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const accessToken = await getAccessToken();
  const url = `${env.apiBaseUrl}/${path.join("/")}${request.nextUrl.search}`;

  const hasBody =
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.method !== "DELETE";
  const requestContentType = request.headers.get("content-type");

  const backendRes = await fetch(url, {
    method: request.method,
    headers: {
      ...(hasBody && requestContentType
        ? { "Content-Type": requestContentType }
        : {}),
      ...internalApiHeaders(),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: hasBody ? request.body : undefined,
    // @ts-expect-error -- not in lib.dom's RequestInit yet
    duplex: hasBody ? "half" : undefined,
  });

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  proxy as DELETE,
  proxy as GET,
  proxy as PATCH,
  proxy as POST,
  proxy as PUT,
};
