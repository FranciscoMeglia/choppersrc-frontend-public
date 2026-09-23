import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { authFetchPage } from "@/lib/api/authFetch";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { formatUsd } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import type { Order } from "@/types/order";

export default async function OrdersPage() {
  const [{ data: orders }, t, tCommon, locale] = await Promise.all([
    authFetchPage<Order[]>("/orders?limit=20"),
    getTranslations("OrdersPage"),
    getTranslations("Common"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-ink/60">
          {t("empty")}{" "}
          <Link href="/products" className="group text-primary hover:underline">
            {tCommon("viewCatalog")}
            <ArrowRight />
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-lg border border-ink/10 p-4 transition-colors hover:border-ink/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{t("orderNumber", { id: order.id })}</p>
                <p className="text-sm text-ink/60">
                  {formatDate(order.createdAt, locale, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <p className="font-medium whitespace-nowrap">
                  {formatUsd(order.total)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
