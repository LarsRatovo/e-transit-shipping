import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  serviceName: process.env.SERVICE_NAME ?? "e-transit-service",
  databaseUrl:
    process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/e_transit_service",
} as const;
