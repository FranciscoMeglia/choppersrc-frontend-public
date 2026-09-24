import type { OrderStatus } from "./order";

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "REFUNDED";

export interface ReturnItem {
  id: number;
  orderItemId: number;
  quantity: number;
  orderItem: {
    id: number;
    productName: string;
    unitPrice: string;
    quantity: number;
    subtotal: string;
  };
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  status: ReturnStatus;
  reason: string | null;
  refundedAmountUsd: string | null;
  items: ReturnItem[];
  order: { id: number; customerName: string; status: OrderStatus };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnItemInput {
  orderItemId: number;
  quantity: number;
}

export interface CreateReturnPayload {
  reason?: string;
  items: CreateReturnItemInput[];
}
