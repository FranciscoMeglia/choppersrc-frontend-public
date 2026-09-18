import Link from "next/link";
import { authFetch } from "@/lib/api/authFetch";
import { ReturnStatusBadge } from "@/components/account/ReturnStatusBadge";
import { formatUsd } from "@/lib/utils/formatPrice";
import type { ReturnRequest } from "@/types/return";

export default async function ReturnsPage() {
  const returns = await authFetch<ReturnRequest[]>("/returns/mine");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Mis devoluciones</h1>
        <p className="mt-1 text-sm text-ink/60">
          Estado de las devoluciones que pediste sobre tus pedidos.
        </p>
      </div>

      {returns.length === 0 ? (
        <p className="text-sm text-ink/60">
          Todavía no pediste ninguna devolución.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10 rounded border border-ink/10">
          {returns.map((ret) => (
            <div key={ret.id} className="flex flex-col gap-3 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">Devolución #{ret.id}</p>
                  <Link
                    href={`/account/orders/${ret.orderId}`}
                    className="text-ink/60 hover:text-primary hover:underline"
                  >
                    Pedido #{ret.orderId}
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
                  <span className="font-medium text-ink">Motivo: </span>
                  {ret.reason}
                </p>
              )}

              {ret.refundedAmountUsd && (
                <p className="text-ink/60">
                  Reembolsado: {formatUsd(ret.refundedAmountUsd)}
                </p>
              )}

              <p className="text-xs text-ink/40">
                {new Date(ret.createdAt).toLocaleDateString("es-AR", {
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
