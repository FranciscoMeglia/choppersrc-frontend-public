import "server-only";
import { env, internalApiHeaders } from "@/config/env";
import { getAccessToken } from "@/lib/auth/cookies";
import { cartItemCount } from "./mapCart";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Cart } from "@/types/cart";

export async function getCart(): Promise<Cart | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const res = await fetch(`${env.apiBaseUrl}/cart`, {
    headers: {
      ...internalApiHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const body = (await res.json()) as
    | ApiSuccessEnvelope<Cart>
    | ApiErrorEnvelope;
  return body.success ? body.data : null;
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart ? cartItemCount(cart) : 0;
}
