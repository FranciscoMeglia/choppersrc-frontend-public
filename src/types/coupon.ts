import type { DiscountType } from "./product";

export interface CouponPreview {
  code: string;
  type: DiscountType;
  value: string;
  discount: string;
}
