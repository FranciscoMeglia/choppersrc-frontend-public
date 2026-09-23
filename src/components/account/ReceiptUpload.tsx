"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/utils/formatDate";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { Order } from "@/types/order";

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M6 3h9l3 3v15l-2-1-2 1-2-1-2 1-2-1-2 1V3Z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

export function ReceiptUpload({
  orderId,
  initialUploadedAt,
}: {
  orderId: number;
  initialUploadedAt: string | null;
}) {
  const t = useTranslations("ReceiptUpload");
  const locale = useLocale();
  const [uploadedAt, setUploadedAt] = useState(initialUploadedAt);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Se guarda acá al elegirlo, todavía sin subir — recién sube al confirmar
  // en el modal (ver ConfirmDialog más abajo). Una vez que `uploadedAt` queda
  // seteado no hay forma de volver a elegir otro: el backend rechaza un
  // segundo POST para el mismo pedido (ver orders.service.js#saveReceipt), a
  // propósito, para que no ande cambiando el comprobante varias veces.
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPendingFile(file);
  }

  async function handleConfirm() {
    if (!pendingFile) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", pendingFile);
      const res = await fetch(`/api/backend/orders/${orderId}/receipt`, {
        method: "POST",
        body: formData,
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<Order>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      setUploadedAt(body.data.receiptUploadedAt);
      setPendingFile(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("uploadError"));
      setPendingFile(null);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleCancel() {
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink/10 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ReceiptIcon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="font-medium text-ink">{t("title")}</p>
          <p className="text-sm text-ink/60">
            {uploadedAt
              ? t("uploadedOn", {
                  date: formatDate(uploadedAt, locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                })
              : t("notUploaded")}
          </p>
        </div>
      </div>

      {!uploadedAt && (
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        {uploadedAt ? (
          <LinkButton
            href={`/api/backend/orders/${orderId}/receipt`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            {t("view")}
          </LinkButton>
        ) : (
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={loading}>
            {t("upload")}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      <ConfirmDialog
        open={pendingFile !== null}
        title={t("confirmTitle")}
        description={t("confirmDescription", { filename: pendingFile?.name ?? "" })}
        confirmLabel={loading ? t("uploading") : t("confirmSubmit")}
        cancelLabel={t("confirmCancel")}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
