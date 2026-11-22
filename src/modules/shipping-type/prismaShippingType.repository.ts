import type { ShippingType as PrismaShippingType } from "../../generated/prisma/client.js";
import { prisma } from "../../database/prisma.js";
import type { ShippingTypeRepository } from "./shippingTypeRepository.js";
import type {
  CreateShippingTypeInput,
  ShippingType,
  UpdateShippingTypeInput,
} from "./shippingType.types.js";

function toDomain(record: PrismaShippingType): ShippingType {
  return {
    ...record,
    unitPrice: record.unitPrice.toNumber(),
  };
}

export class PrismaShippingTypeRepository implements ShippingTypeRepository {
  async create(input: CreateShippingTypeInput): Promise<ShippingType> {
    return toDomain(await prisma.shippingType.create({ data: input }));
  }

  async findAll(): Promise<ShippingType[]> {
    const records = await prisma.shippingType.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
    return records.map(toDomain);
  }

  async findById(id: string, includeDeleted = false): Promise<ShippingType | null> {
    const record = await prisma.shippingType.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
    });
    return record ? toDomain(record) : null;
  }

  async findByName(name: string): Promise<ShippingType | null> {
    const record = await prisma.shippingType.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    return record ? toDomain(record) : null;
  }

  async update(id: string, input: UpdateShippingTypeInput): Promise<ShippingType> {
    return toDomain(await prisma.shippingType.update({ where: { id }, data: input }));
  }

  async remove(id: string): Promise<void> {
    await prisma.shippingType.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<ShippingType> {
    return toDomain(
      await prisma.shippingType.update({ where: { id }, data: { deletedAt: null } }),
    );
  }
}
