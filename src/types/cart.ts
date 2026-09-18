import type { Product } from "./product";
import type { PaymentMethod } from "./order";

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface CartLineItem {
  productId: number;
  slug: string;
  name: string;
  quantity: number;
  priceUsd: string;
  priceArs: string;
  finalPriceUsd: string;
  finalPriceArs: string;
  stock: number;
  images: string[];
}

export interface CheckoutPayload {
  paymentMethod: PaymentMethod;
  addressId?: number;
  shippingAddress?: string;
  couponCode?: string;
  notes?: string;
}
