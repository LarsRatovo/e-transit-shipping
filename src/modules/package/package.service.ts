import { AppError } from "../../middleware/app-error.js";
import type { ShippingTypeRepository } from "../shipping-type/shippingTypeRepository.js";
import type { CreatePackageInput, Package, UpdatePackageInput } from "./package.types.js";
import type { PackageRepository } from "./packageRepository.js";

type ShippingTypeReader = Pick<ShippingTypeRepository, "findById">;

export class PackageService {
  constructor(
    private readonly repository: PackageRepository,
    private readonly shippingTypes: ShippingTypeReader,
  ) {}

  async create(input: CreatePackageInput): Promise<Package> {
    await this.ensureShippingTypeExists(input.shippingTypeId);
    return this.repository.create(input);
  }

  findAll(): Promise<Package[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Package> {
    const packageRecord = await this.repository.findById(id);
    if (!packageRecord) throw this.notFound();
    return packageRecord;
  }

  async update(id: string, input: UpdatePackageInput): Promise<Package> {
    await this.findById(id);
    if (input.shippingTypeId !== undefined) {
      await this.ensureShippingTypeExists(input.shippingTypeId);
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.remove(id);
  }

  async restore(id: string): Promise<Package> {
    const packageRecord = await this.repository.findById(id, true);
    if (!packageRecord) throw this.notFound();
    if (!packageRecord.deletedAt) {
      throw new AppError("Package is not deleted", 409, "PACKAGE_NOT_DELETED");
    }
    await this.ensureShippingTypeExists(packageRecord.shippingTypeId);
    return this.repository.restore(id);
  }

  private async ensureShippingTypeExists(id: string): Promise<void> {
    if (!(await this.shippingTypes.findById(id))) {
      throw new AppError("Shipping type not found", 404, "SHIPPING_TYPE_NOT_FOUND");
    }
  }

  private notFound(): AppError {
    return new AppError("Package not found", 404, "PACKAGE_NOT_FOUND");
  }
}
