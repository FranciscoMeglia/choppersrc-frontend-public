import "server-only";
import { env } from "@/config/env";
import { getAccessToken } from "@/lib/auth/cookies";
import { ApiError } from "./client";
import type {
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  Pagination,
} from "@/types/api";

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccessEnvelope<T>> {
  const accessToken = await getAccessToken();
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  const body = (await res.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  if (!body.success) {
    throw new ApiError(body.message, body.statusCode, body.errors);
  }
  return body;
}

export async function authFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return (await request<T>(path, init)).data;
}

export async function authFetchPage<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; pagination: Pagination }> {
  const body = await request<T>(path, init);
  if (!body.meta) {
    throw new Error(`authFetchPage: "${path}" didn't return meta.pagination`);
  }
  return { data: body.data, pagination: body.meta.pagination };
}
