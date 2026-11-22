import bodyParser from "body-parser";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { packageRouter } from "./modules/package/package.routes.js";
import { shippingTypeRouter } from "./modules/shipping-type/shippingType.routes.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/api-docs.json", (_request, response) => response.json(openApiDocument));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/packages", packageRouter);
  app.use("/api/v1/shipping-types", shippingTypeRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
