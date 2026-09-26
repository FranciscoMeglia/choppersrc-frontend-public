import { useTranslations } from "next-intl";
import { ORDER_STATUS_BADGE_CLASSES } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("OrderStatus");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${ORDER_STATUS_BADGE_CLASSES[status]}`}
    >
      {t(status)}
    </span>
  );
}
