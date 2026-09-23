import { useLocale, useTranslations } from "next-intl";
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_ICONS } from "@/lib/orderStatus";
import { formatDate } from "@/lib/utils/formatDate";
import type { OrderStatusHistoryEntry } from "@/types/order";

export function OrderStatusTimeline({
  history,
}: {
  history: OrderStatusHistoryEntry[];
}) {
  const t = useTranslations("OrderStatusTimeline");
  const tStatus = useTranslations("OrderStatus");
  const locale = useLocale();
  const sorted = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="rounded-xl bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold text-ink">{t("title")}</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {sorted.map((entry, i) => {
          const Icon = ORDER_STATUS_ICONS[entry.status];
          return (
            <li key={entry.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ORDER_STATUS_BADGE_CLASSES[entry.status]}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {i < sorted.length - 1 && (
                  <span className="w-px flex-1 bg-ink/10" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-ink">
                  {tStatus(entry.status)}
                </p>
                {entry.note && (
                  <p className="text-sm text-ink/60">{entry.note}</p>
                )}
                <p className="mt-0.5 text-xs text-ink/40">
                  {formatDate(entry.createdAt, locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
