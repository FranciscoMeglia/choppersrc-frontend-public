"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ReceiptUpload({
  orderId,
  initialUploadedAt,
}: {
  orderId: number;
  initialUploadedAt: string | null;
}) {
  const [uploadedAt, setUploadedAt] = useState(initialUploadedAt);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);
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
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo subir el comprobante",
      );
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink/10 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ReceiptIcon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="font-medium text-ink">Comprobante de transferencia</p>
          <p className="text-sm text-ink/60">
            {uploadedAt
              ? `Subido el ${formatDateTime(uploadedAt)}`
              : "Todavía no subiste nada."}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-3">
        {uploadedAt && (
          <LinkButton
            href={`/api/backend/orders/${orderId}/receipt`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Ver comprobante
          </LinkButton>
        )}
        <Button
          type="button"
          variant={uploadedAt ? "secondary" : "primary"}
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? "Subiendo..." : uploadedAt ? "Reemplazar" : "Subir comprobante"}
        </Button>
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}
    </div>
  );
}
