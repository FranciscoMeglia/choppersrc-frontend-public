import { useTranslations } from "next-intl";
import type { UsedListingStatus } from "@/types/usedListing";

const COLORS: Record<UsedListingStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-primary/20 bg-primary/10 text-primary",
  REJECTED: "border-ink/15 bg-ink/5 text-ink/50",
  TAKEN_DOWN: "border-ink/15 bg-ink/5 text-ink/50 line-through",
  SOLD: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function UsedListingStatusBadge({ status }: { status: UsedListingStatus }) {
  const t = useTranslations("UsedListingStatus");

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${COLORS[status]}`}
    >
      {t(status)}
    </span>
  );
}
