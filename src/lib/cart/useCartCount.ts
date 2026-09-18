"use client";

import { useSyncExternalStore } from "react";
import { getLocalCartCount } from "./localCart";
import { getCartCountSnapshot, subscribeCartCount } from "./cartCountStore";

export function useCartCount(initialCount: number): number {
  return useSyncExternalStore(
    subscribeCartCount,
    () =>
      getCartCountSnapshot(
        initialCount > 0 ? initialCount : getLocalCartCount(),
      ),
    () => initialCount,
  );
}
