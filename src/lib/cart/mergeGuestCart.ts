import { clearLocalCart, getLocalCart } from "./localCart";

export async function mergeGuestCartIntoAccount(): Promise<void> {
  const items = getLocalCart();
  if (items.length === 0) return;

  await Promise.all(
    items.map((item) =>
      fetch("/api/backend/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
        }),
      }).catch(() => {
      }),
    ),
  );

  clearLocalCart();
}
