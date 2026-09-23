import { getTranslations } from "next-intl/server";
import { authFetch } from "@/lib/api/authFetch";
import { AddressesManager } from "@/components/account/AddressesManager";
import type { Address } from "@/types/address";

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
