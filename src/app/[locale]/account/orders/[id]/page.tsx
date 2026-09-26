import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { authFetch } from "@/lib/api/authFetch";
import { apiFetch, ApiError } from "@/lib/api/client";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { OrderStatusTimeline } from "@/components/account/OrderStatusTimeline";
import { ReceiptUpload } from "@/components/account/ReceiptUpload";
import { BankTransferDetails } from "@/components/checkout/BankTransferDetails";
import { formatArs, formatUsd } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { Order } from "@/types/order";

const PAYMENT_ICONS: Record<Order["paymentMethod"], ComponentType<{ className?: string }>> = {
  TRANSFERENCIA: BankIcon,
  EFECTIVO: CashIcon,
};

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 10h3.6l3.4 3v2.5h-7z" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

function StoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M3 9l1-5h16l1 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9v10h16V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 19v-5a3 3 0 0 1 6 0v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M3 9.5 12 4l9 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5v9M10 9.5v9M14 9.5v9M19 9.5v9" strokeLinecap="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  );
}

function CashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ justPlaced?: string }>;
};

// Privada — noindex.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "OrdersPage" });
  const title = t("orderNumber", { id });
  return buildMetadata({ locale: locale as AppLocale, href: `/account/orders/${id}`, title, description: title, noIndex: true });
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { justPlaced } = await searchParams;

  const settingsPromise = getPublicSettings();
  const [t, tPayment, locale] = await Promise.all([
    getTranslations("OrderDetailPage"),
    getTranslations("PaymentMethodSelector"),
    getLocale(),
  ]);
  const PAYMENT_LABELS: Record<Order["paymentMethod"], string> = {
    TRANSFERENCIA: tPayment("bankTransferLabel"),
    EFECTIVO: tPayment("cashLabel"),
  };

  let order: Order;
  try {
    order = await authFetch<Order>(`/orders/${id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 404 || error.statusCode === 403)
    ) {
      notFound();
    }
    throw error;
  }

  const DeliveryIcon = order.shippingAddress ? TruckIcon : StoreIcon;
  const PaymentIcon = PAYMENT_ICONS[order.paymentMethod];
  const awaitingTransfer =
    order.paymentMethod === "TRANSFERENCIA" && order.status === "PENDING_PAYMENT";
  const settings = await settingsPromise;

  return (
    <div className="flex flex-col gap-8">
      {justPlaced && (
        <div className="rounded border border-primary/20 bg-primary/5 p-4 text-sm">
          <p className="font-medium text-primary">{t("thanksTitle")}</p>
          <p className="mt-1 text-ink/70">
            {awaitingTransfer
              ? t("thanksTransfer", { id: order.id })
              : t("thanksGeneric", { id: order.id })}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/account/orders"
            className="text-sm text-ink/60 hover:text-primary"
          >
            {t("backToOrders")}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">
            {t("orderNumber", { id: order.id })}
          </h1>
          <p className="text-sm text-ink/60">
            {formatDate(order.createdAt, locale, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded border border-ink/10">
        <div className="grid grid-cols-1 divide-y divide-ink/10">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 text-sm"
            >
              <div className="min-w-0">
                {item.product ? (
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  <p className="font-medium">{item.productName}</p>
                )}
                <p className="text-ink/60">
                  {item.quantity} × {formatUsd(item.unitPrice)}
                </p>
              </div>
              <p className="shrink-0 font-medium">{formatUsd(item.subtotal)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t border-ink/10 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">{t("subtotal")}</span>
            <span>{formatUsd(order.subtotal)}</span>
          </div>
          {Number(order.couponDiscount) > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">{t("discount")}</span>
              <span>-{formatUsd(order.couponDiscount)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between text-base font-semibold">
            <span>{t("total")}</span>
            <span>{formatUsd(order.total)}</span>
          </div>
          <div className="flex justify-between text-xs text-ink/50">
            <span>{t("estimatedArs")}</span>
            <span>{formatArs(order.totalArs)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-lg border border-ink/10 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <DeliveryIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-medium text-ink">{t("delivery")}</p>
            <p className="mt-0.5 text-ink/70">
              {order.shippingAddress ?? t("pickupAtStore")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-ink/10 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PaymentIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-medium text-ink">{t("payment")}</p>
            <p className="mt-0.5 text-ink/70">
              {PAYMENT_LABELS[order.paymentMethod]}
            </p>
          </div>
        </div>
      </div>

      {awaitingTransfer && settings && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BankTransferDetails settings={settings} />
          <ReceiptUpload
            orderId={order.id}
            initialUploadedAt={order.receiptUploadedAt}
          />
        </div>
      )}

      {order.status === "DELIVERED" && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 p-4 text-sm">
          <div>
            <p className="font-medium text-ink">{t("returnTitle")}</p>
            <p className="mt-0.5 text-ink/60">{t("returnSubtitle")}</p>
          </div>
          <Link href="/contact" className="text-sm font-medium text-primary hover:underline">
            {t("returnCta")}
          </Link>
        </div>
      )}

      {order.statusHistory.length > 0 && (
        <OrderStatusTimeline history={order.statusHistory} />
      )}
    </div>
  );
}
