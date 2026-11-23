import type { Package as PrismaPackage } from "../../generated/prisma/client.js";
import { prisma } from "../../database/prisma.js";
import { PackageStatus, type CreatePackageInput, type Package, type UpdatePackageInput } from "./package.types.js";
import type { PackageRepository } from "./packageRepository.js";

function toDomainStatus(statusAsString : string) : PackageStatus{
  switch (statusAsString) {
    case "ARRIVED":
      return PackageStatus.ARRIVED;
    case "RECEIVED":
      return PackageStatus.RECEIVED;
    case "DELIVERED_OR_COLLECTED":
      return PackageStatus.DELIVERED_OR_COLLECTED;
    case "IN_TRANSIT":
      return PackageStatus.IN_TRANSIT;
    default:
      return PackageStatus.UNKNOWN;
  }
}

function toDomain(record: PrismaPackage): Package {
  return {
    ...record,
    status : toDomainStatus(record.status),
    measure: record.measure.toNumber(),
    price: record.price.toNumber(),
  };
}

export class PrismaPackageRepository implements PackageRepository {
  
  async create(input: CreatePackageInput): Promise<Package> {
    return toDomain(await prisma.package.create({ data: {...input,status:PackageStatus.UNKNOWN.toString()} }));
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
    return toDomain(await prisma.package.update({ where: { id }, data: {...input,status:input.status.toString()} }));
  }

  async remove(id: string): Promise<void> {
    await prisma.package.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<Package> {
    return toDomain(await prisma.package.update({ where: { id }, data: { deletedAt: null } }));
  }
}
