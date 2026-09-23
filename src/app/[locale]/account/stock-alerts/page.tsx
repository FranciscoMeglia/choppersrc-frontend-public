import { getTranslations } from "next-intl/server";
import { authFetch } from "@/lib/api/authFetch";
import { StockAlertRow } from "@/components/account/StockAlertRow";
import type { StockAlert } from "@/types/stockAlert";

export default async function StockAlertsPage() {
  const [alerts, t] = await Promise.all([
    authFetch<StockAlert[]>("/stock-alerts/mine"),
    getTranslations("StockAlertsPage"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-ink/60">{t("empty")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10 rounded border border-ink/10">
          {alerts.map((alert) => (
            <StockAlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
