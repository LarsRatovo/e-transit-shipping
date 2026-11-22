import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { AppError } from "../../src/middleware/app-error.js";
import { PackageService } from "../../src/modules/package/package.service.js";
import type { CreatePackageInput, Package, UpdatePackageInput } from "../../src/modules/package/package.types.js";
import type { PackageRepository } from "../../src/modules/package/packageRepository.js";
import type { ShippingType } from "../../src/modules/shipping-type/shippingType.types.js";

class InMemoryPackageRepository implements PackageRepository {
  records: Package[] = [];
  async create(input: CreatePackageInput): Promise<Package> {
    const now = new Date();
    const record = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now, deletedAt: null };
    this.records.push(record);
    return record;
  }
  async findAll(): Promise<Package[]> { return this.records.filter((record) => !record.deletedAt); }
  async findById(id: string, includeDeleted = false): Promise<Package | null> {
    return this.records.find((record) => record.id === id && (includeDeleted || !record.deletedAt)) ?? null;
  }
  async update(id: string, input: UpdatePackageInput): Promise<Package> {
    const record = (await this.findById(id, true))!;
    Object.assign(record, input, { updatedAt: new Date() });
    return record;
  }
  async remove(id: string): Promise<void> { (await this.findById(id, true))!.deletedAt = new Date(); }
  async restore(id: string): Promise<Package> {
    const record = (await this.findById(id, true))!;
    record.deletedAt = null;
    return record;
  }
}

describe("PackageService", () => {
  const shippingType: ShippingType = {
    id: crypto.randomUUID(), name: "By weight", unitPrice: 10, unit: "KG",
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
  };
  let repository: InMemoryPackageRepository;
  let service: PackageService;

  beforeEach(() => {
    repository = new InMemoryPackageRepository();
    service = new PackageService(repository, {
      findById: async (id) => id === shippingType.id ? shippingType : null,
    });
  });

  it("creates and lists a package", async () => {
    const created = await service.create({
      clientId: crypto.randomUUID(), shippingTypeId: shippingType.id, measure: 2.5, price: 25,
    });
    assert.deepEqual(await service.findAll(), [created]);
  });

  it("rejects an unknown shipping type", async () => {
    await assert.rejects(service.create({
      clientId: crypto.randomUUID(), shippingTypeId: crypto.randomUUID(), measure: 2, price: 20,
    }), (error: unknown) => error instanceof AppError && error.code === "SHIPPING_TYPE_NOT_FOUND");
  });

  it("updates a package", async () => {
    const created = await service.create({
      clientId: crypto.randomUUID(), shippingTypeId: shippingType.id, measure: 2, price: 20,
    });
    const updated = await service.update(created.id, { measure: 3, price: 30 });
    assert.equal(updated.measure, 3);
    assert.equal(updated.price, 30);
  });

  it("soft-deletes and restores a package", async () => {
    const created = await service.create({
      clientId: crypto.randomUUID(), shippingTypeId: shippingType.id, measure: 2, price: 20,
    });
    await service.remove(created.id);
    assert.deepEqual(await service.findAll(), []);
    await service.restore(created.id);
    assert.deepEqual(await service.findAll(), [created]);
  });

  it("returns a typed error for an unknown package", async () => {
    await assert.rejects(service.findById(crypto.randomUUID()),
      (error: unknown) => error instanceof AppError && error.code === "PACKAGE_NOT_FOUND");
  });
});
