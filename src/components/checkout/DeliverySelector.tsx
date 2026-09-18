"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AddressForm } from "@/components/account/AddressForm";
import { formatAddressLine } from "@/lib/utils/formatAddress";
import type { Address } from "@/types/address";

export type DeliverySelection =
  | { type: "pickup" }
  | { type: "address"; addressId: number };

const MAX_ADDRESSES = 2;
const radioClass = "mt-0.5 accent-primary";

export function DeliverySelector({
  initialAddresses,
  value,
  onChange,
}: {
  initialAddresses: Address[];
  value: DeliverySelection;
  onChange: (value: DeliverySelection) => void;
}) {
  const t = useTranslations("DeliverySelector");
  const tHeader = useTranslations("Header");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [addingNew, setAddingNew] = useState(false);

  function handleAddressSaved(address: Address) {
    setAddresses((current) => [...current, address]);
    setAddingNew(false);
    onChange({ type: "address", addressId: address.id });
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((address) => (
        <label
          key={address.id}
          className={`flex cursor-pointer items-start gap-3 rounded border p-3 text-sm transition-colors ${
            value.type === "address" && value.addressId === address.id
              ? "border-primary bg-primary/5"
              : "border-ink/15 hover:border-ink/30"
          }`}
        >
          <input
            type="radio"
            name="delivery"
            className={radioClass}
            checked={value.type === "address" && value.addressId === address.id}
            onChange={() => onChange({ type: "address", addressId: address.id })}
          />
          <span>
            {address.label && <span className="block font-medium">{address.label}</span>}
            <span className="text-ink/70">{formatAddressLine(address)}</span>
          </span>
        </label>
      ))}

      <label
        className={`flex cursor-pointer items-start gap-3 rounded border p-3 text-sm transition-colors ${
          value.type === "pickup"
            ? "border-primary bg-primary/5"
            : "border-ink/15 hover:border-ink/30"
        }`}
      >
        <input
          type="radio"
          name="delivery"
          className={radioClass}
          checked={value.type === "pickup"}
          onChange={() => onChange({ type: "pickup" })}
        />
        <span>
          <span className="block font-medium">{t("pickupTitle")}</span>
          <span className="text-ink/60">{t("pickupHint")}</span>
        </span>
      </label>

      {addingNew ? (
        <AddressForm
          onSaved={handleAddressSaved}
          onCancel={() => setAddingNew(false)}
        />
      ) : (
        addresses.length < MAX_ADDRESSES && (
          <button
            type="button"
            onClick={() => setAddingNew(true)}
            className="self-start text-sm text-primary hover:underline"
          >
            {t("addAddress")}
          </button>
        )
      )}

      <p className="text-xs text-ink/40">
        {t("manageAddressesPrefix")}{" "}
        <Link href="/account/addresses" className="underline underline-offset-2">
          {tHeader("myAccount")}
        </Link>
        .
      </p>
    </div>
  );
}
