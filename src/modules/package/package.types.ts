export enum PackageStatus{
  RECEIVED,
  IN_TRANSIT,
  ARRIVED,
  DELIVERED_OR_COLLECTED,
  UNKNOWN
}
export interface Package {
  id: string;
  clientId: string;
  shippingTypeId: string;
  measure: number;
  price: number;
  status : PackageStatus;
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

export interface UpdatePackageInput {
  clientId: string;
  shippingTypeId: string;
  status : PackageStatus;
  measure: number;
  price: number;
}
