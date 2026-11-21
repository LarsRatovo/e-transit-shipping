import { env } from "../config/env.js";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: `${env.serviceName} API`,
    version: "1.0.0",
    description: `API documentation for ${env.serviceName}.`,
  },
  servers: [{ url: "/api/v1", description: "Current API server" }],
  tags: [{ name: "Health", description: "Service and database availability" }],
  paths: {
    "/health": {
      get: {
        operationId: "getHealth",
        tags: ["Health"],
        summary: "Check service health",
        responses: {
          "200": {
            description: "Service is available",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } },
            },
          },
          "503": {
            description: "Database is unavailable",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["status", "database", "timestamp"],
        properties: {
          status: { type: "string", enum: ["ok", "unavailable"] },
          database: { type: "string", enum: ["connected", "disconnected"] },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;
