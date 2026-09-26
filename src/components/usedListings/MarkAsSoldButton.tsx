"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast/toastStore";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { UsedListing } from "@/types/usedListing";

export function MarkAsSoldButton({ listingId }: { listingId: number }) {
  const t = useTranslations("MyUsedListingsPage");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/backend/used-listings/${listingId}/sold`, {
        method: "PATCH",
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<UsedListing>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      showToast(t("markSoldSuccess"));
      setOpen(false);
      router.refresh();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t("markSoldError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-ink/20 px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
      >
        {t("markAsSold")}
      </button>
      <ConfirmDialog
        open={open}
        title={t("markSoldConfirmTitle")}
        description={t("markSoldConfirmDescription")}
        confirmLabel={loading ? t("markingAsSold") : t("markSoldConfirm")}
        cancelLabel={t("markSoldCancel")}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
