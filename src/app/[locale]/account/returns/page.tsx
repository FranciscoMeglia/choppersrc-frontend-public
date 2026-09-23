import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { authFetch } from "@/lib/api/authFetch";
import { ReturnStatusBadge } from "@/components/account/ReturnStatusBadge";
import { formatUsd } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import type { ReturnRequest } from "@/types/return";

export default async function ReturnsPage() {
  const [returns, t, locale] = await Promise.all([
    authFetch<ReturnRequest[]>("/returns/mine"),
    getTranslations("ReturnsPage"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      {returns.length === 0 ? (
        <p className="text-sm text-ink/60">{t("empty")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10 rounded border border-ink/10">
          {returns.map((ret) => (
            <div key={ret.id} className="flex flex-col gap-3 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{t("returnNumber", { id: ret.id })}</p>
                  <Link
                    href={`/account/orders/${ret.orderId}`}
                    className="text-ink/60 hover:text-primary hover:underline"
                  >
                    {t("orderNumber", { id: ret.orderId })}
                  </Link>
                </div>
                <ReturnStatusBadge status={ret.status} />
              </div>

              <ul className="text-ink/70">
                {ret.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.orderItem.productName}
                  </li>
                ))}
              </ul>

              {ret.reason && (
                <p className="text-ink/60">
                  <span className="font-medium text-ink">{t("reason")} </span>
                  {ret.reason}
                </p>
              )}

              {ret.refundedAmountUsd && (
                <p className="text-ink/60">
                  {t("refunded", { amount: formatUsd(ret.refundedAmountUsd) })}
                </p>
              )}

              <p className="text-xs text-ink/40">
                {formatDate(ret.createdAt, locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
