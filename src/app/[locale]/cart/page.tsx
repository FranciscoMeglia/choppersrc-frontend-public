import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getCart } from "@/lib/cart/session";
import { cartToLines, hydrateCartLines } from "@/lib/cart/mapCart";
import { CartView } from "@/components/cart/CartView";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

// Transaccional, sin valor de búsqueda — noindex (ver robots.ts, que además
// la bloquea del todo para crawlers).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CartView" });
  return buildMetadata({ locale: locale as AppLocale, href: "/cart", title: t("title"), description: t("title"), noIndex: true });
}

export default async function CartPage() {
  const user = await getCurrentUser();
  const cart = user ? await getCart() : null;
  const items = cart ? await hydrateCartLines(cartToLines(cart)) : [];

  return <CartView isAuthenticated={Boolean(user)} initialItems={items} />;
}
