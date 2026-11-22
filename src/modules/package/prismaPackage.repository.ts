import type { Package as PrismaPackage } from "../../generated/prisma/client.js";
import { prisma } from "../../database/prisma.js";
import type { CreatePackageInput, Package, UpdatePackageInput } from "./package.types.js";
import type { PackageRepository } from "./packageRepository.js";

function toDomain(record: PrismaPackage): Package {
  return {
    ...record,
    measure: record.measure.toNumber(),
    price: record.price.toNumber(),
  };
}

export class PrismaPackageRepository implements PackageRepository {
  async create(input: CreatePackageInput): Promise<Package> {
    return toDomain(await prisma.package.create({ data: input }));
  }

  async findAll(): Promise<Package[]> {
    const records = await prisma.package.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return records.map(toDomain);
  }

  async findById(id: string, includeDeleted = false): Promise<Package | null> {
    const record = await prisma.package.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
    });
    return record ? toDomain(record) : null;
  }

  async update(id: string, input: UpdatePackageInput): Promise<Package> {
    return toDomain(await prisma.package.update({ where: { id }, data: input }));
  }

  async remove(id: string): Promise<void> {
    await prisma.package.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<Package> {
    return toDomain(await prisma.package.update({ where: { id }, data: { deletedAt: null } }));
  }
}
