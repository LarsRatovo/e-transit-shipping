import type { CreatePackageInput, Package, UpdatePackageInput } from "./package.types.js";

export interface PackageRepository {
  create(input: CreatePackageInput): Promise<Package>;
  findAll(): Promise<Package[]>;
  findById(id: string, includeDeleted?: boolean): Promise<Package | null>;
  update(id: string, input: UpdatePackageInput): Promise<Package>;
  remove(id: string): Promise<void>;
  restore(id: string): Promise<Package>;
}
