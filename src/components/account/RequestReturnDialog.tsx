"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { CreateReturnItemInput, ReturnRequest } from "@/types/return";
import type { OrderItem } from "@/types/order";

const inputClass =
  "w-full rounded border border-ink/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";

export function RequestReturnDialog({
  orderId,
  items,
  open,
  onClose,
}: {
  orderId: number;
  items: OrderItem[];
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("RequestReturnDialog");
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function setQuantity(orderItemId: number, quantity: number, max: number) {
    setQuantities((q) => ({ ...q, [orderItemId]: Math.max(0, Math.min(quantity, max)) }));
  }

  function handleClose() {
    setQuantities({});
    setReason("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const returnItems: CreateReturnItemInput[] = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([orderItemId, quantity]) => ({ orderItemId: Number(orderItemId), quantity }));

    if (returnItems.length === 0) {
      setError(t("selectAtLeastOne"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/backend/orders/${orderId}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || undefined, items: returnItems }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<ReturnRequest>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      handleClose();
      router.push("/account/returns");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("submitError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="presentation"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-return-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg bg-background p-5 shadow-xl"
      >
        <h2 id="request-return-title" className="font-medium text-ink">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded border border-ink/15 p-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{item.productName}</p>
                  <p className="text-ink/50">{t("purchased", { count: item.quantity })}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={item.quantity}
                  value={quantities[item.id] ?? 0}
                  onChange={(event) => setQuantity(item.id, Number(event.target.value), item.quantity)}
                  className="w-16 rounded border border-ink/20 px-2 py-1.5 text-center text-sm"
                />
              </div>
            ))}
          </div>

          <label className="text-sm">
            {t("reason")} <span className="text-ink/40">{t("optional")}</span>
            <textarea
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={`mt-1 ${inputClass} resize-none`}
            />
          </label>

          {error && <p className="text-sm text-primary">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="text-sm text-ink/60 hover:text-ink"
            >
              {t("cancel")}
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
