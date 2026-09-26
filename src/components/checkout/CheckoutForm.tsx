"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { DeliverySelector, type DeliverySelection } from "./DeliverySelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CouponInput } from "./CouponInput";
import { OrderSummary } from "./OrderSummary";
import { dispatchCartUpdated } from "@/lib/cart/localCart";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import type { Address } from "@/types/address";
import type { CartLineItem } from "@/types/cart";
import type { CouponPreview } from "@/types/coupon";
import type { Order, PaymentMethod } from "@/types/order";
import type { PublicSettings } from "@/types/settings";

const textareaClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";

export function CheckoutForm({
  user,
  items,
  initialAddresses,
  settings,
}: {
  user: AuthUser;
  items: CartLineItem[];
  initialAddresses: Address[];
  settings: PublicSettings;
}) {
  const t = useTranslations("CheckoutForm");
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliverySelection>(
    initialAddresses.length > 0
      ? { type: "address", addressId: initialAddresses[0].id }
      : { type: "pickup" },
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("TRANSFERENCIA");
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/backend/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          ...(delivery.type === "address"
            ? { addressId: delivery.addressId }
            : {}),
          ...(coupon ? { couponCode: coupon.code } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<Order>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      dispatchCartUpdated(0);
      router.push(`/account/orders/${body.data.id}?justPlaced=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("submitError"));
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-8 lg:col-span-2">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{t("yourData")}</h2>
            <Link
              href="/account"
              className="text-sm text-ink/60 hover:text-primary"
            >
              {t("edit")}
            </Link>
          </div>
          <div className="rounded border border-ink/10 p-3 text-sm">
            <p>{user.name}</p>
            <p className="text-ink/60">{user.email}</p>
            {user.phone && <p className="text-ink/60">{user.phone}</p>}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-medium">{t("shippingMethod")}</h2>
          <DeliverySelector
            initialAddresses={initialAddresses}
            value={delivery}
            onChange={setDelivery}
          />
          <p className="text-xs text-ink/50">{settings.shippingDisclaimer}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-medium">{t("paymentMethodTitle")}</h2>
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
            settings={settings}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-medium">
            {t("coupon")}{" "}
            <span className="font-normal text-ink/40">{t("optional")}</span>
          </h2>
          <CouponInput
            applied={coupon}
            onApply={setCoupon}
            onRemove={() => setCoupon(null)}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-medium">
            {t("orderNotes")}{" "}
            <span className="font-normal text-ink/40">{t("optional")}</span>
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder={t("notesPlaceholder")}
            className={textareaClass}
          />
        </section>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="flex flex-col gap-4">
          <OrderSummary items={items} coupon={coupon} />

          {error && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-primary">{error}</p>
              <Link
                href="/cart"
                className="text-sm text-ink/60 underline hover:text-primary"
              >
                {t("backToCart")}
              </Link>
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? t("confirming") : t("confirmOrder")}
          </Button>
        </div>
      </div>
    </div>
  );
}
