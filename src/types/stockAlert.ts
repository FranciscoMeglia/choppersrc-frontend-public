export interface StockAlertProduct {
  id: number;
  name: string;
  slug: string;
  priceUsd: string;
  stock: number;
  images: string[];
}

export interface StockAlert {
  id: number;
  productId: number;
  createdAt: string;
  product: StockAlertProduct;
}
