"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Modal de confirmación genérico — sin librería de terceros, sólo overlay +
 * tarjeta centrada. Pensado para acciones "de una sola vez" donde conviene
 * frenar al usuario antes de confirmar (ver ReceiptUpload, el primer caso de
 * uso: un comprobante subido no se puede reemplazar).
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-background p-5 shadow-xl"
      >
        <h2 id="confirm-dialog-title" className="font-medium text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink/60">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-sm text-ink/60 hover:text-ink"
          >
            {cancelLabel}
          </button>
          <Button type="button" onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
