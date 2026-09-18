import {
  Clock,
  CreditCard,
  PackageCheck,
  PackageSearch,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus } from "@/types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAYMENT_CONFIRMED: "Pago confirmado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-[#fef3c7] text-[#92400e]",
  PAYMENT_CONFIRMED: "bg-[#dbeafe] text-[#1e40af]",
  PROCESSING: "bg-[#ede9fe] text-[#5b21b6]",
  SHIPPED: "bg-[#ccfbf1] text-[#0f766e]",
  DELIVERED: "bg-[#dcfce7] text-[#166534]",
  CANCELLED: "bg-[#fee2e2] text-[#991b1b]",
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  PENDING_PAYMENT: Clock,
  PAYMENT_CONFIRMED: CreditCard,
  PROCESSING: PackageSearch,
  SHIPPED: Truck,
  DELIVERED: PackageCheck,
  CANCELLED: XCircle,
};
