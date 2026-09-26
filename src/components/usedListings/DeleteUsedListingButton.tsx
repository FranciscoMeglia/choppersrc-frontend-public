"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast/toastStore";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

export function DeleteUsedListingButton({ listingId }: { listingId: number }) {
  const t = useTranslations("MyUsedListingsPage");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/backend/used-listings/${listingId}`, {
        method: "DELETE",
      });
      const body = (await res.json()) as ApiSuccessEnvelope<null> | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      showToast(t("deleteSuccess"));
      setOpen(false);
      router.refresh();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t("deleteError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-ink/20 px-3 py-1.5 text-xs text-ink/60 hover:border-primary hover:text-primary"
      >
        {t("delete")}
      </button>
      <ConfirmDialog
        open={open}
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription")}
        confirmLabel={loading ? t("deleting") : t("deleteConfirm")}
        cancelLabel={t("deleteCancel")}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
