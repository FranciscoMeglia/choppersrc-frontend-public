"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RequestReturnDialog } from "./RequestReturnDialog";
import type { OrderItem } from "@/types/order";

export function RequestReturnButton({ orderId, items }: { orderId: number; items: OrderItem[] }) {
  const t = useTranslations("RequestReturnDialog");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-primary hover:underline"
      >
        {t("trigger")}
      </button>
      <RequestReturnDialog orderId={orderId} items={items} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
