"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Address } from "@/types/address";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm";

export function AddressForm({
  address,
  onSaved,
  onCancel,
}: {
  address?: Address;
  onSaved: (address: Address) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("AddressForm");
  const [label, setLabel] = useState(address?.label ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [floorUnit, setFloorUnit] = useState(address?.floorUnit ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [province, setProvince] = useState(address?.province ?? "");
  const [postalCode, setPostalCode] = useState(address?.postalCode ?? "");
  const [reference, setReference] = useState(address?.reference ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        address ? `/api/backend/addresses/${address.id}` : "/api/backend/addresses",
        {
          method: address ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: label.trim() || undefined,
            street,
            floorUnit: floorUnit.trim() || undefined,
            city,
            province,
            postalCode,
            reference: reference.trim() || undefined,
          }),
        },
      );
      const body = (await res.json()) as
        | ApiSuccessEnvelope<Address>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      onSaved(body.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("saveError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded border border-ink/10 p-4"
    >
      <label className={labelClass}>
        <span>
          {t("labelField")} <span className="text-ink/40">{t("optional")}</span>
        </span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("labelPlaceholder")}
          maxLength={50}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("street")}
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            minLength={3}
            maxLength={200}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          <span>
            {t("floorUnit")} <span className="text-ink/40">{t("optional")}</span>
          </span>
          <input
            type="text"
            value={floorUnit}
            onChange={(e) => setFloorUnit(e.target.value)}
            placeholder={t("floorUnitPlaceholder")}
            maxLength={50}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("city")}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          {t("province")}
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        {t("postalCode")}
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          className={`max-w-40 ${inputClass}`}
        />
      </label>

      <label className={labelClass}>
        <span>
          {t("reference")} <span className="text-ink/40">{t("optional")}</span>
        </span>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder={t("referencePlaceholder")}
          maxLength={200}
          className={inputClass}
        />
      </label>

      {error && <p className="text-sm text-primary">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : t("save")}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-ink/60 hover:text-ink"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
