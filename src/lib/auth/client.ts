import { ApiError } from "@/lib/api/client";
import { mergeGuestCartIntoAccount } from "@/lib/cart/mergeGuestCart";
import { setCartCount } from "@/lib/cart/cartCountStore";
import { getLocalCartCount } from "@/lib/cart/localCart";
import { cartItemCount } from "@/lib/cart/mapCart";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import type { Cart } from "@/types/cart";

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  if (!body.success)
    throw new ApiError(body.message, body.statusCode, body.errors);
  return body.data;
}

async function refreshCartCount() {
  try {
    const res = await fetch("/api/backend/cart");
    const body = (await res.json()) as
      | ApiSuccessEnvelope<Cart>
      | ApiErrorEnvelope;
    setCartCount(body.success ? cartItemCount(body.data) : 0);
  } catch {
  }
}

export async function login(email: string, password: string) {
  const result = await postJson<{ user: AuthUser }>("/api/auth/login", {
    email,
    password,
  });
  await mergeGuestCartIntoAccount();
  await refreshCartCount();
  return result;
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string,
) {
  const result = await postJson<{ user: AuthUser }>("/api/auth/register", {
    name,
    email,
    password,
    phone,
  });
  await mergeGuestCartIntoAccount();
  await refreshCartCount();
  return result;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  setCartCount(getLocalCartCount());
}
