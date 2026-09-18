"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { CouponPreview } from "@/types/coupon";

export function CouponInput({
  applied,
  onApply,
  onRemove,
}: {
  applied: CouponPreview | null;
  onApply: (coupon: CouponPreview) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("CouponInput");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/backend/coupons/${encodeURIComponent(code.trim())}/preview`,
      );
      const body = (await res.json()) as
        | ApiSuccessEnvelope<CouponPreview>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      onApply(body.data);
      setCode("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("invalidCoupon"));
    } finally {
      setLoading(false);
    }
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
        <span>
          {t.rich("couponApplied", {
            code: applied.code,
            b: (chunks) => <span className="font-medium">{chunks}</span>,
          })}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-ink/50 hover:text-primary"
        >
          {t("remove")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 rounded border border-ink/20 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none"
        />
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? t("verifying") : t("apply")}
        </Button>
      </div>
      {error && <p className="text-sm text-primary">{error}</p>}
    </form>
  );
}
