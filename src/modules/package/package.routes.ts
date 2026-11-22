import { Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../../middleware/validate-request.js";
import {
  createPackage,
  deletePackage,
  getPackage,
  listPackages,
  restorePackage,
  updatePackage,
} from "./package.controller.js";

export const packageRouter = Router();

const idValidation = param("id").isUUID().withMessage("id must be a valid UUID");
const clientValidation = body("clientId")
  .isUUID()
  .withMessage("clientId must be a valid UUID");
const shippingTypeValidation = body("shippingTypeId")
  .isUUID()
  .withMessage("shippingTypeId must be a valid UUID");
const measureValidation = body("measure")
  .isFloat({ gt: 0, max: 999_999_999.999 })
  .withMessage("measure must be a positive number")
  .toFloat();
const priceValidation = body("price")
  .isFloat({ gt: 0, max: 9_999_999_999.99 })
  .withMessage("price must be a positive number")
  .toFloat();

packageRouter.post(
  "/",
  clientValidation,
  shippingTypeValidation,
  measureValidation,
  priceValidation,
  validateRequest,
  createPackage,
);
packageRouter.get("/", listPackages);
packageRouter.get("/:id", idValidation, validateRequest, getPackage);
packageRouter.patch(
  "/:id",
  idValidation,
  clientValidation.optional(),
  shippingTypeValidation.optional(),
  measureValidation.optional(),
  priceValidation.optional(),
  body().custom((_value, { req }) => {
    if (!["clientId", "shippingTypeId", "measure", "price"].some((key) => req.body[key] !== undefined)) {
      throw new Error("At least one package field is required");
    }
    return true;
  }),
  validateRequest,
  updatePackage,
);
packageRouter.delete("/:id", idValidation, validateRequest, deletePackage);
packageRouter.post("/:id/restore", idValidation, validateRequest, restorePackage);
