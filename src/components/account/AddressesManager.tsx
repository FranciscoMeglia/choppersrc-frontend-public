"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AddressForm } from "./AddressForm";
import { formatAddressLine } from "@/lib/utils/formatAddress";
import type { Address } from "@/types/address";

const MAX_ADDRESSES = 2;

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path
        d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M6 7l1 13a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8l1-13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="opacity-90" />
    </svg>
  );
}

export function AddressesManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const t = useTranslations("AddressesManager");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleSaved(address: Address) {
    setAddresses((current) => {
      const exists = current.some((a) => a.id === address.id);
      return exists
        ? current.map((a) => (a.id === address.id ? address : a))
        : [...current, address];
    });
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/backend/addresses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((current) => current.filter((a) => a.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((address) =>
        editingId === address.id ? (
          <AddressForm
            key={address.id}
            address={address}
            onSaved={handleSaved}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={address.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-ink/10 p-4 transition-colors hover:border-ink/20"
          >
            <div className="text-sm">
              {address.label && (
                <p className="font-medium">{address.label}</p>
              )}
              <p className="text-ink/70">{formatAddressLine(address)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setEditingId(address.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-ink/30 hover:bg-ink/5 hover:text-ink"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                {t("edit")}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(address.id)}
                disabled={deletingId === address.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:opacity-50"
              >
                {deletingId === address.id ? (
                  <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <TrashIcon className="h-3.5 w-3.5" />
                )}
                {deletingId === address.id ? t("deleting") : t("delete")}
              </button>
            </div>
          </div>
        ),
      )}

      {addresses.length === 0 && editingId !== "new" && (
        <p className="text-sm text-ink/60">{t("empty")}</p>
      )}

      {editingId === "new" ? (
        <AddressForm
          onSaved={handleSaved}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        addresses.length < MAX_ADDRESSES && (
          <div>
            <Button variant="secondary" onClick={() => setEditingId("new")}>
              {t("add")}
            </Button>
          </div>
        )
      )}

      {addresses.length >= MAX_ADDRESSES && editingId !== "new" && (
        <p className="text-xs text-ink/50">
          {t("maxReached", { max: MAX_ADDRESSES })}
        </p>
      )}
    </div>
  );
}
