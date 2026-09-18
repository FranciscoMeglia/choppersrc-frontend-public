import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

export function sendSuccess<T>(
  data: T,
  message = "OK",
  statusCode = 200,
): ApiSuccessEnvelope<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    meta: null,
    timestamp: new Date().toISOString(),
  };
}

export function sendError(
  message: string,
  statusCode = 400,
  errors: ApiErrorEnvelope["errors"] = null,
): ApiErrorEnvelope {
  return {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
}
