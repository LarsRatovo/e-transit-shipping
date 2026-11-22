export const SHIPPING_UNITS = ["PIECE", "CBM", "KG"] as const;

export type ShippingUnit = (typeof SHIPPING_UNITS)[number];

export interface ShippingType {
  id: string;
  name: string;
  unitPrice: number;
  unit: ShippingUnit;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateShippingTypeInput {
  name: string;
  unitPrice: number;
  unit: ShippingUnit;
}

export type UpdateShippingTypeInput = Partial<CreateShippingTypeInput>;
