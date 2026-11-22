import { AppError } from "../../middleware/app-error.js";
import type { ShippingTypeRepository } from "./shippingTypeRepository.js";
import type {
  CreateShippingTypeInput,
  ShippingType,
  UpdateShippingTypeInput,
} from "./shippingType.types.js";

export class ShippingTypeService {
  constructor(private readonly repository: ShippingTypeRepository) {}

  async create(input: CreateShippingTypeInput): Promise<ShippingType> {
    await this.ensureNameIsAvailable(input.name);
    return this.repository.create({ ...input, name: input.name.trim() });
  }

  findAll(): Promise<ShippingType[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<ShippingType> {
    const shippingType = await this.repository.findById(id);
    if (!shippingType) throw this.notFound();
    return shippingType;
  }

  async update(id: string, input: UpdateShippingTypeInput): Promise<ShippingType> {
    await this.findById(id);
    if (input.name !== undefined) {
      const normalizedName = input.name.trim();
      const existing = await this.repository.findByName(normalizedName);
      if (existing && existing.id !== id) throw this.nameConflict();
      input = { ...input, name: normalizedName };
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.remove(id);
  }

  async restore(id: string): Promise<ShippingType> {
    const shippingType = await this.repository.findById(id, true);
    if (!shippingType) throw this.notFound();
    if (!shippingType.deletedAt) {
      throw new AppError("Shipping type is not deleted", 409, "SHIPPING_TYPE_NOT_DELETED");
    }
    return this.repository.restore(id);
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    if (await this.repository.findByName(name.trim())) throw this.nameConflict();
  }

  private notFound(): AppError {
    return new AppError("Shipping type not found", 404, "SHIPPING_TYPE_NOT_FOUND");
  }

  private nameConflict(): AppError {
    return new AppError(
      "A shipping type with this name already exists",
      409,
      "SHIPPING_TYPE_NAME_CONFLICT",
    );
  }
}
