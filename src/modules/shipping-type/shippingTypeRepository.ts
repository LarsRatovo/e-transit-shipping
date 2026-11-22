import type {
  CreateShippingTypeInput,
  ShippingType,
  UpdateShippingTypeInput,
} from "./shippingType.types.js";

export interface ShippingTypeRepository {
  create(input: CreateShippingTypeInput): Promise<ShippingType>;
  findAll(): Promise<ShippingType[]>;
  findById(id: string, includeDeleted?: boolean): Promise<ShippingType | null>;
  findByName(name: string): Promise<ShippingType | null>;
  update(id: string, input: UpdateShippingTypeInput): Promise<ShippingType>;
  remove(id: string): Promise<void>;
  restore(id: string): Promise<ShippingType>;
}
