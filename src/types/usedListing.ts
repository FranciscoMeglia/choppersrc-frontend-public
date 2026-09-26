export type UsedListingStatus = "PENDING" | "APPROVED" | "REJECTED" | "TAKEN_DOWN" | "SOLD";

export interface UsedListing {
  id: number;
  title: string;
  description: string;
  // En pesos, a diferencia de Product.priceUsd — cada vendedor lo fija a mano
  // (ver used-listings.validator.js en el backend).
  price: string;
  images: string[];
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string; slug: string } | null;
  status: UsedListingStatus;
  rejectionReason: string | null;
  lastConfirmedAt: string;
  createdAt: string;
  updatedAt: string;
}
