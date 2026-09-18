import { authFetch } from "@/lib/api/authFetch";
import { AddressesManager } from "@/components/account/AddressesManager";
import type { Address } from "@/types/address";

export default async function AddressesPage() {
  const addresses = await authFetch<Address[]>("/addresses");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Mis direcciones</h1>
        <p className="mt-1 text-sm text-ink/60">
          Hasta 2 direcciones de envío, solo dentro de Argentina.
        </p>
      </div>

      <AddressesManager initialAddresses={addresses} />
    </div>
  );
}
