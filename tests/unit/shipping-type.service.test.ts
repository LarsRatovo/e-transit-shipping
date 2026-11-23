import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ShippingTypeRepository } from "../../src/modules/shipping-type/shippingTypeRepository.js";
import { ShippingTypeService } from "../../src/modules/shipping-type/shippingType.service.js";
import type {
  CreateShippingTypeInput,
  ShippingType,
  UpdateShippingTypeInput,
} from "../../src/modules/shipping-type/shippingType.types.js";

describe("ShippingTypeService", () => {
  let repository: jest.Mocked<ShippingTypeRepository>;
  let service: ShippingTypeService;

  const makeShippingType = (overrides: Partial<ShippingType> = {}): ShippingType => ({
    id: crypto.randomUUID(),
    name: "Parcel",
    unitPrice: 10,
    unit: "PIECE",
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
      findByName: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      restore: jest.fn(),
    };
    service = new ShippingTypeService(repository);
  });

  it("creates and lists a shipping type", async () => {
    const input: CreateShippingTypeInput = { name: " Parcel ", unitPrice: 10.5, unit: "PIECE" };
    const created = makeShippingType({ name: "Parcel", unitPrice: input.unitPrice, unit: input.unit });
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);
    repository.findAll.mockResolvedValue([created]);

    await expect(service.create(input)).resolves.toEqual(created);
    await expect(service.findAll()).resolves.toEqual([created]);
    expect(repository.findByName).toHaveBeenCalledWith("Parcel");
    expect(repository.create).toHaveBeenCalledWith({ ...input, name: "Parcel" });
  });

  it("rejects duplicate names case-insensitively", async () => {
    const existing = makeShippingType();
    repository.findByName.mockResolvedValue(existing);

    await expect(service.create({ name: "parcel", unitPrice: 12, unit: "KG" }))
      .rejects.toMatchObject({ code: "SHIPPING_TYPE_NAME_CONFLICT", statusCode: 409 });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("updates a shipping type", async () => {
    const existing = makeShippingType();
    const input: UpdateShippingTypeInput = { unitPrice: 15, unit: "KG" };
    const updated = makeShippingType({ ...existing, ...input });
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    await expect(service.update(existing.id, input)).resolves.toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith(existing.id, input);
  });

  it("soft-deletes and restores a shipping type", async () => {
    const existing = makeShippingType();
    const deleted = makeShippingType({ ...existing, deletedAt: new Date() });
    const restored = makeShippingType({ ...existing, deletedAt: null });
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

  it("returns a typed error for an unknown shipping type", async () => {
    const id = crypto.randomUUID();
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(id)).rejects.toMatchObject({
      code: "SHIPPING_TYPE_NOT_FOUND",
      statusCode: 404,
    });
  });
});
