import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MyUsedListingsManager } from "@/components/usedListings/MyUsedListingsManager";
import { authFetch } from "@/lib/api/authFetch";
import { getCurrentUser } from "@/lib/auth/session";
import { getCategories } from "@/lib/catalog/facets";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { UsedListing } from "@/types/usedListing";

type Props = { params: Promise<{ locale: string }> };

// Privada — noindex.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MyUsedListingsPage" });
  return buildMetadata({ locale: locale as AppLocale, href: "/account/used-listings", title: t("title"), description: t("subtitle"), noIndex: true });
}

export default async function MyUsedListingsPage() {
  const [listings, categories, user] = await Promise.all([
    authFetch<UsedListing[]>("/used-listings/mine"),
    getCategories(),
    getCurrentUser(),
  ]);

  // Garantizado no-null: AccountLayout ya redirige a /login si no hay sesión.
  const currentUser = user!;

  return <MyUsedListingsManager listings={listings} categories={categories} user={currentUser} />;
}
