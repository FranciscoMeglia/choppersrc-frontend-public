import { getCurrentUser } from "@/lib/auth/session";
import { getCart } from "@/lib/cart/session";
import { cartToLines, hydrateCartLines } from "@/lib/cart/mapCart";
import { CartView } from "@/components/cart/CartView";

export default async function CartPage() {
  const user = await getCurrentUser();
  const cart = user ? await getCart() : null;
  const items = cart ? await hydrateCartLines(cartToLines(cart)) : [];

  return <CartView isAuthenticated={Boolean(user)} initialItems={items} />;
}
