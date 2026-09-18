
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "TRANSFERENCIA" | "EFECTIVO";

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
  product: { id: number; name: string; slug: string } | null;
}

export interface OrderStatusHistoryEntry {
  id: number;
  status: OrderStatus;
  note: string | null;
  changedBy: number | null;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string | null;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: string;
  couponDiscount: string;
  total: string;
  exchangeRate: string;
  exchangeRateSource: string;
  exchangeRateAt: string;
  totalArs: string;
  notes: string | null;
  receiptFilename: string | null;
  receiptUploadedAt: string | null;
  items: OrderItem[];
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
