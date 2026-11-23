import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { CustomerRepository } from "../../src/modules/customer/customer.repository.js";
import { PackageService } from "../../src/modules/package/package.service.js";
import {
  PackageStatus,
  type CreatePackageInput,
  type Package,
  type UpdatePackageInput,
} from "../../src/modules/package/package.types.js";
import type { PackageRepository } from "../../src/modules/package/packageRepository.js";
import type { ShippingType } from "../../src/modules/shipping-type/shippingType.types.js";

describe("PackageService", () => {
  const shippingType: ShippingType = {
    id: crypto.randomUUID(), name: "By weight", unitPrice: 10, unit: "KG",
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
  };
  let repository: jest.Mocked<PackageRepository>;
  let customers: jest.Mocked<CustomerRepository>;
  let service: PackageService;

  const makePackage = (overrides: Partial<Package> = {}): Package => ({
    id: crypto.randomUUID(),
    clientId: crypto.randomUUID(),
    shippingTypeId: shippingType.id,
    measure: 2,
    price: 20,
    status: PackageStatus.RECEIVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  });

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      restore: jest.fn(),
    };
    customers = {
      find: jest.fn(async (id) => ({ id, name: "Test customer", shippingMark: "TEST" })),
      findAll: jest.fn(async (ids) => ids.map((id) => ({ id, name: "Test customer", shippingMark: "TEST" }))),
    };
    service = new PackageService(repository, {
      findById: jest.fn(async (id) => id === shippingType.id ? shippingType : null),
    }, customers);
  });

  it("creates and lists a package", async () => {
    const input: CreatePackageInput = {
      clientId: crypto.randomUUID(), shippingTypeId: shippingType.id, measure: 2.5, price: 25,
    };
    const created = makePackage(input);
    repository.create.mockResolvedValue(created);
    repository.findAll.mockResolvedValue([created]);

    await expect(service.create(input)).resolves.toEqual(created);
    await expect(service.findAll()).resolves.toEqual([created]);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("rejects an unknown shipping type", async () => {
    await expect(service.create({
      clientId: crypto.randomUUID(), shippingTypeId: crypto.randomUUID(), measure: 2, price: 20,
    })).rejects.toMatchObject({ code: "SHIPPING_TYPE_NOT_FOUND" });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("updates a package", async () => {
    const existing = makePackage();
    const input: UpdatePackageInput = {
      clientId: existing.clientId,
      shippingTypeId: existing.shippingTypeId,
      status: existing.status,
      measure: 3,
      price: 30,
    };
    const updated = makePackage({ ...existing, ...input });
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    await expect(service.update(existing.id, input)).resolves.toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith(existing.id, input);
  });

  it("soft-deletes and restores a package", async () => {
    const existing = makePackage();
    const deleted = makePackage({ ...existing, deletedAt: new Date() });
    const restored = makePackage({ ...existing, deletedAt: null });
    repository.findById
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(deleted);
    repository.findAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([restored]);
    repository.remove.mockResolvedValue();
    repository.restore.mockResolvedValue(restored);

    await service.remove(existing.id);
    await expect(service.findAll()).resolves.toEqual([]);
    await expect(service.restore(existing.id)).resolves.toEqual(restored);
    await expect(service.findAll()).resolves.toEqual([restored]);
    expect(repository.remove).toHaveBeenCalledWith(existing.id);
    expect(repository.findById).toHaveBeenLastCalledWith(existing.id, true);
    expect(repository.restore).toHaveBeenCalledWith(existing.id);
  });

  it("returns a typed error for an unknown package", async () => {
    const id = crypto.randomUUID();
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(id)).rejects.toMatchObject({
      code: "PACKAGE_NOT_FOUND",
      statusCode: 404,
    });
  });
});
