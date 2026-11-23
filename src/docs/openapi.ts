import { env } from "../config/env.js";

const errorResponse = {
  description: "Request failed",
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
} as const;

const shippingTypeResponse = {
  description: "Shipping type",
  content: { "application/json": { schema: { $ref: "#/components/schemas/ShippingType" } } },
} as const;

const packageResponse = {
  description: "Package",
  content: { "application/json": { schema: { $ref: "#/components/schemas/Package" } } },
} as const;

const idParameter = {
  name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" },
} as const;

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: `${env.serviceName} API`, version: "1.0.0",
    description: `API documentation for ${env.serviceName}.`,
  },
  servers: [{ url: "/api/v1", description: "Current API server" }],
  tags: [
    { name: "Health", description: "Service and database availability" },
    { name: "Packages", description: "Package management" },
    { name: "Shipping Types", description: "Shipping type management" },
  ],
  paths: {
    "/health": {
      get: {
        operationId: "getHealth", tags: ["Health"], summary: "Check service health",
        responses: {
          "200": { description: "Service is available", content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } } },
          "503": { description: "Database is unavailable", content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } } },
        },
      },
    },
    "/packages": {
      get: {
        operationId: "listPackages", tags: ["Packages"], summary: "List active packages",
        responses: { "200": { description: "Package list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Package" } } } } } },
      },
      post: {
        operationId: "createPackage", tags: ["Packages"], summary: "Register a package",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PackageInput" } } } },
        responses: { "201": packageResponse, "400": errorResponse, "404": errorResponse },
      },
    },
    "/packages/{id}": {
      get: {
        operationId: "getPackage", tags: ["Packages"], summary: "Get a package", parameters: [idParameter],
        responses: { "200": packageResponse, "400": errorResponse, "404": errorResponse },
      },
      put: {
        operationId: "updatePackage", tags: ["Packages"], summary: "Update a package", parameters: [idParameter],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PackageUpdateInput" } } } },
        responses: { "200": packageResponse, "400": errorResponse, "404": errorResponse },
      },
      delete: {
        operationId: "deletePackage", tags: ["Packages"], summary: "Soft-delete a package", parameters: [idParameter],
        responses: { "204": { description: "Package deleted" }, "400": errorResponse, "404": errorResponse },
      },
    },
    "/packages/{id}/restore": {
      post: {
        operationId: "restorePackage", tags: ["Packages"], summary: "Restore a deleted package", parameters: [idParameter],
        responses: { "200": packageResponse, "400": errorResponse, "404": errorResponse, "409": errorResponse },
      },
    },
    "/shipping-types": {
      get: {
        operationId: "listShippingTypes", tags: ["Shipping Types"], summary: "List active shipping types",
        responses: { "200": { description: "Shipping type list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/ShippingType" } } } } } },
      },
      post: {
        operationId: "createShippingType", tags: ["Shipping Types"], summary: "Create a shipping type",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShippingTypeInput" } } } },
        responses: { "201": shippingTypeResponse, "400": errorResponse, "409": errorResponse },
      },
    },
    "/shipping-types/{id}": {
      get: {
        operationId: "getShippingType", tags: ["Shipping Types"], summary: "Get a shipping type", parameters: [idParameter],
        responses: { "200": shippingTypeResponse, "400": errorResponse, "404": errorResponse },
      },
      put: {
        operationId: "updateShippingType", tags: ["Shipping Types"], summary: "Update a shipping type", parameters: [idParameter],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShippingTypeUpdateInput" } } } },
        responses: { "200": shippingTypeResponse, "400": errorResponse, "404": errorResponse, "409": errorResponse },
      },
      delete: {
        operationId: "deleteShippingType", tags: ["Shipping Types"], summary: "Soft-delete a shipping type", parameters: [idParameter],
        responses: { "204": { description: "Shipping type deleted" }, "400": errorResponse, "404": errorResponse },
      },
    },
    "/shipping-types/{id}/restore": {
      post: {
        operationId: "restoreShippingType", tags: ["Shipping Types"], summary: "Restore a deleted shipping type", parameters: [idParameter],
        responses: { "200": shippingTypeResponse, "400": errorResponse, "404": errorResponse, "409": errorResponse },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object", required: ["status", "database", "timestamp"],
        properties: {
          status: { type: "string", enum: ["ok", "unavailable"] },
          database: { type: "string", enum: ["connected", "disconnected"] },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      Package: {
        type: "object",
        required: ["id", "clientId", "shippingTypeId", "measure", "price", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          clientId: { type: "string", format: "uuid" },
          shippingTypeId: { type: "string", format: "uuid" },
          measure: { type: "number", format: "double", example: 2.5 },
          price: { type: "number", format: "double", example: 25 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
      PackageInput: {
        type: "object", additionalProperties: false,
        required: ["clientId", "shippingTypeId", "measure", "price"],
        properties: {
          clientId: { type: "string", format: "uuid" },
          shippingTypeId: { type: "string", format: "uuid" },
          measure: { type: "number", exclusiveMinimum: true, minimum: 0 },
          price: { type: "number", exclusiveMinimum: true, minimum: 0 },
        },
      },
      PackageUpdateInput: {
        type: "object", additionalProperties: false, minProperties: 1,
        properties: {
          clientId: { type: "string", format: "uuid" },
          shippingTypeId: { type: "string", format: "uuid" },
          measure: { type: "number", exclusiveMinimum: true, minimum: 0 },
          price: { type: "number", exclusiveMinimum: true, minimum: 0 },
        },
      },
      ShippingType: {
        type: "object", required: ["id", "name", "unitPrice", "unit", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" }, name: { type: "string", example: "Standard parcel" },
          unitPrice: { type: "number", format: "double", example: 12.5 }, unit: { type: "string", enum: ["PIECE", "CBM", "KG"] },
          createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
      ShippingTypeInput: {
        type: "object", additionalProperties: false, required: ["name", "unitPrice", "unit"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 }, unitPrice: { type: "number", exclusiveMinimum: true, minimum: 0 },
          unit: { type: "string", enum: ["PIECE", "CBM", "KG"] },
        },
      },
      ShippingTypeUpdateInput: {
        type: "object", additionalProperties: false, minProperties: 1,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 }, unitPrice: { type: "number", exclusiveMinimum: true, minimum: 0 },
          unit: { type: "string", enum: ["PIECE", "CBM", "KG"] },
        },
      },
      Error: {
        type: "object", required: ["error"],
        properties: { error: { type: "object", required: ["code", "message"], properties: {
          code: { type: "string" }, message: { type: "string" }, details: { type: "array", items: { type: "object" } },
        } } },
      },
    },
  },
} as const;
