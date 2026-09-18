export interface Address {
  id: number;
  label: string | null;
  street: string;
  floorUnit: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: "AR";
  reference: string | null;
}
