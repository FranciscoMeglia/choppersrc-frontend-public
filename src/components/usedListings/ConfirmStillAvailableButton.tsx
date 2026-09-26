"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { showToast } from "@/lib/toast/toastStore";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { UsedListing } from "@/types/usedListing";

export function ConfirmStillAvailableButton({ listingId }: { listingId: number }) {
  const t = useTranslations("MyUsedListingsPage");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/backend/used-listings/${listingId}/confirm`, {
        method: "PATCH",
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<UsedListing>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      showToast(t("confirmSuccess"));
      router.refresh();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t("confirmError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded border border-ink/20 px-3 py-1.5 text-xs hover:border-primary hover:text-primary disabled:opacity-50"
    >
      {loading ? t("confirming") : t("confirmStillAvailable")}
    </button>
  );
}
