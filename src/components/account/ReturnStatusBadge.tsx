import { useTranslations } from "next-intl";
import type { ReturnStatus } from "@/types/return";

const COLORS: Record<ReturnStatus, string> = {
  REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-ink/15 bg-ink/5 text-ink/70",
  RECEIVED: "border-ink/15 bg-ink/5 text-ink/70",
  REFUNDED: "border-primary/20 bg-primary/10 text-primary",
  REJECTED: "border-ink/15 bg-ink/5 text-ink/50 line-through",
};

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const t = useTranslations("ReturnStatus");

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${COLORS[status]}`}
    >
      {t(status)}
    </span>
  );
}
