import type { RequestHandler } from "express";
import { PrismaShippingTypeRepository } from "./prismaShippingType.repository.js";
import { ShippingTypeService } from "./shippingType.service.js";
import type {
  CreateShippingTypeInput,
  UpdateShippingTypeInput,
} from "./shippingType.types.js";

const service = new ShippingTypeService(new PrismaShippingTypeRepository());

function shippingTypeId(request: Parameters<RequestHandler>[0]): string {
  return request.params.id as string;
}

export const createShippingType: RequestHandler = async (request, response) => {
  const { name, unitPrice, unit } = request.body as CreateShippingTypeInput;
  const input = { name, unitPrice, unit };
  response.status(201).json(await service.create(input));
};

export const listShippingTypes: RequestHandler = async (_request, response) => {
  response.json(await service.findAll());
};

export const getShippingType: RequestHandler = async (request, response) => {
  response.json(await service.findById(shippingTypeId(request)));
};

export const updateShippingType: RequestHandler = async (request, response) => {
  const body = request.body as UpdateShippingTypeInput;
  const input: UpdateShippingTypeInput = {};
  if (body.name !== undefined) input.name = body.name;
  if (body.unitPrice !== undefined) input.unitPrice = body.unitPrice;
  if (body.unit !== undefined) input.unit = body.unit;
  response.json(await service.update(shippingTypeId(request), input));
};

export const deleteShippingType: RequestHandler = async (request, response) => {
  await service.remove(shippingTypeId(request));
  response.status(204).send();
};

export const restoreShippingType: RequestHandler = async (request, response) => {
  response.json(await service.restore(shippingTypeId(request)));
};
