export interface Package {
  id: string;
  clientId: string;
  shippingTypeId: string;
  measure: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreatePackageInput {
  clientId: string;
  shippingTypeId: string;
  measure: number;
  price: number;
}

export type UpdatePackageInput = Partial<CreatePackageInput>;
