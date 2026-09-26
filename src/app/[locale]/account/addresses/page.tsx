import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { authFetch } from "@/lib/api/authFetch";
import { AddressesManager } from "@/components/account/AddressesManager";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { Address } from "@/types/address";

type Props = { params: Promise<{ locale: string }> };

// Privada — noindex.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AddressesPage" });
  return buildMetadata({ locale: locale as AppLocale, href: "/account/addresses", title: t("title"), description: t("subtitle"), noIndex: true });
}

export default async function AddressesPage() {
  const [addresses, t] = await Promise.all([
    authFetch<Address[]>("/addresses"),
    getTranslations("AddressesPage"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <AddressesManager initialAddresses={addresses} />
    </div>
  );
}
