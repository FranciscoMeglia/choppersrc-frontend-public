import type { Address } from "@/types/address";

export function formatAddressLine(address: Address): string {
  const floorUnit = address.floorUnit ? `, ${address.floorUnit}` : "";
  const reference = address.reference ? ` — Ref: ${address.reference}` : "";
  return `${address.street}${floorUnit}, ${address.city}, ${address.province} (${address.postalCode}), Argentina${reference}`;
}
