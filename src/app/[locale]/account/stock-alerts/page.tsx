import { authFetch } from "@/lib/api/authFetch";
import { StockAlertRow } from "@/components/account/StockAlertRow";
import type { StockAlert } from "@/types/stockAlert";

export default async function StockAlertsPage() {
  const alerts = await authFetch<StockAlert[]>("/stock-alerts/mine");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Alertas de stock</h1>
        <p className="mt-1 text-sm text-ink/60">
          Te avisamos por email apenas vuelva a haber stock de estos
          productos.
        </p>
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-ink/60">
          No tenés avisos activos. Activalos desde la ficha de un producto sin
          stock.
        </p>
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
