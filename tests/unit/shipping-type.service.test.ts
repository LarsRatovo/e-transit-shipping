import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { AppError } from "../../src/middleware/app-error.js";
import type { ShippingTypeRepository } from "../../src/modules/shipping-type/shippingTypeRepository.js";
import { ShippingTypeService } from "../../src/modules/shipping-type/shippingType.service.js";
import type { CreateShippingTypeInput, ShippingType, UpdateShippingTypeInput } from "../../src/modules/shipping-type/shippingType.types.js";

class InMemoryShippingTypeRepository implements ShippingTypeRepository {
  records: ShippingType[] = [];
  async create(input: CreateShippingTypeInput): Promise<ShippingType> {
    const now = new Date();
    const record = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now, deletedAt: null };
    this.records.push(record);
    return record;
  }
  async findAll(): Promise<ShippingType[]> { return this.records.filter((record) => !record.deletedAt); }
  async findById(id: string, includeDeleted = false): Promise<ShippingType | null> {
    return this.records.find((record) => record.id === id && (includeDeleted || !record.deletedAt)) ?? null;
  }
  async findByName(name: string): Promise<ShippingType | null> {
    return this.records.find((record) => record.name.toLowerCase() === name.toLowerCase()) ?? null;
  }
  async update(id: string, input: UpdateShippingTypeInput): Promise<ShippingType> {
    const record = (await this.findById(id, true))!;
    Object.assign(record, input, { updatedAt: new Date() });
    return record;
  }
  async remove(id: string): Promise<void> { (await this.findById(id, true))!.deletedAt = new Date(); }
  async restore(id: string): Promise<ShippingType> {
    const record = (await this.findById(id, true))!;
    record.deletedAt = null;
    return record;
  }
}

describe("ShippingTypeService", () => {
  let repository: InMemoryShippingTypeRepository;
  let service: ShippingTypeService;
  beforeEach(() => {
    repository = new InMemoryShippingTypeRepository();
    service = new ShippingTypeService(repository);
  });
  it("creates and lists a shipping type", async () => {
    const created = await service.create({ name: " Parcel ", unitPrice: 10.5, unit: "PIECE" });
    assert.equal(created.name, "Parcel");
    assert.deepEqual(await service.findAll(), [created]);
  });
  it("rejects duplicate names case-insensitively", async () => {
    await service.create({ name: "Parcel", unitPrice: 10, unit: "PIECE" });
    await assert.rejects(service.create({ name: "parcel", unitPrice: 12, unit: "KG" }),
      (error: unknown) => error instanceof AppError && error.code === "SHIPPING_TYPE_NAME_CONFLICT");
  });
  it("updates a shipping type", async () => {
    const created = await service.create({ name: "Parcel", unitPrice: 10, unit: "PIECE" });
    const updated = await service.update(created.id, { unitPrice: 15, unit: "KG" });
    assert.equal(updated.unitPrice, 15);
    assert.equal(updated.unit, "KG");
  });
  it("soft-deletes and restores a shipping type", async () => {
    const created = await service.create({ name: "Parcel", unitPrice: 10, unit: "PIECE" });
    await service.remove(created.id);
    assert.deepEqual(await service.findAll(), []);
    await service.restore(created.id);
    assert.deepEqual(await service.findAll(), [created]);
  });
  it("returns a typed error for an unknown shipping type", async () => {
    await assert.rejects(service.findById(crypto.randomUUID()),
      (error: unknown) => error instanceof AppError && error.statusCode === 404);
  });
});
