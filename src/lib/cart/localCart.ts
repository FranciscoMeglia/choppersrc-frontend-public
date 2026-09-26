export interface LocalCartItem {
  productId: number;
  slug: string;
  quantity: number;
}

import { setCartCount } from "./cartCountStore";

const STORAGE_KEY = "choppersrc:cart";

export const dispatchCartUpdated = setCartCount;

function totalQuantity(items: LocalCartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: LocalCartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  dispatchCartUpdated(totalQuantity(items));
}

export function getLocalCartCount(): number {
  return totalQuantity(getLocalCart());
}

export function addLocalItem(
  productId: number,
  slug: string,
  quantity = 1,
  maxQuantity?: number,
): boolean {
  const items = getLocalCart();
  const existing = items.find((item) => item.productId === productId);
  const currentQuantity = existing?.quantity ?? 0;
  if (maxQuantity !== undefined && currentQuantity + quantity > maxQuantity) {
    return false;
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, slug, quantity });
  }
  setLocalCart(items);
  return true;
}

export function updateLocalItem(productId: number, quantity: number) {
  setLocalCart(
    getLocalCart().map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    ),
  );
}

export function removeLocalItem(productId: number) {
  setLocalCart(getLocalCart().filter((item) => item.productId !== productId));
}

export function clearLocalCart() {
  window.localStorage.removeItem(STORAGE_KEY);
  dispatchCartUpdated(0);
}
