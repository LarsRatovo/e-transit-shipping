import type { RequestHandler } from "express";
import { PrismaShippingTypeRepository } from "../shipping-type/prismaShippingType.repository.js";
import { PackageService } from "./package.service.js";
import type { CreatePackageInput, UpdatePackageInput } from "./package.types.js";
import { PrismaPackageRepository } from "./prismaPackage.repository.js";

const service = new PackageService(
  new PrismaPackageRepository(),
  new PrismaShippingTypeRepository(),
);

function packageId(request: Parameters<RequestHandler>[0]): string {
  return request.params.id as string;
}

export const createPackage: RequestHandler = async (request, response) => {
  const { clientId, shippingTypeId, measure, price } = request.body as CreatePackageInput;
  response.status(201).json(await service.create({ clientId, shippingTypeId, measure, price }));
};

export const listPackages: RequestHandler = async (_request, response) => {
  response.json(await service.findAll());
};

export const getPackage: RequestHandler = async (request, response) => {
  response.json(await service.findById(packageId(request)));
};

export const updatePackage: RequestHandler = async (request, response) => {
  const body = request.body as UpdatePackageInput;
  const input: UpdatePackageInput = {};
  if (body.clientId !== undefined) input.clientId = body.clientId;
  if (body.shippingTypeId !== undefined) input.shippingTypeId = body.shippingTypeId;
  if (body.measure !== undefined) input.measure = body.measure;
  if (body.price !== undefined) input.price = body.price;
  response.json(await service.update(packageId(request), input));
};

export const deletePackage: RequestHandler = async (request, response) => {
  await service.remove(packageId(request));
  response.status(204).send();
};

export const restorePackage: RequestHandler = async (request, response) => {
  response.json(await service.restore(packageId(request)));
};
