import { env } from "@/config/env";
import type {
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  Pagination,
} from "@/types/api";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: ApiErrorEnvelope["errors"];

  constructor(
    message: string,
    statusCode: number,
    errors: ApiErrorEnvelope["errors"] = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccessEnvelope<T>> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(env.isServer && env.internalApiKey
        ? { "X-Internal-Key": env.internalApiKey, "X-Channel": "public" }
        : {}),
      ...init?.headers,
    },
  });

  const body = (await res.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  if (!body.success) {
    throw new ApiError(body.message, body.statusCode, body.errors);
  }
  return body;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return (await request<T>(path, init)).data;
}

export async function apiFetchPage<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; pagination: Pagination }> {
  const body = await request<T>(path, init);
  if (!body.meta) {
    throw new Error(`apiFetchPage: "${path}" didn't return meta.pagination`);
  }
  return { data: body.data, pagination: body.meta.pagination };
}
