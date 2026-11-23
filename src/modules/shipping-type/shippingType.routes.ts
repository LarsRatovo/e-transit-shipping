import { Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../../middleware/validate-request.js";
import {
  createShippingType,
  deleteShippingType,
  getShippingType,
  listShippingTypes,
  restoreShippingType,
  updateShippingType,
} from "./shippingType.controller.js";
import { SHIPPING_UNITS } from "./shippingType.types.js";

export const shippingTypeRouter = Router();

const idValidation = param("id").isUUID().withMessage("id must be a valid UUID");
const nameValidation = body("name")
  .isString()
  .withMessage("name must be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("name is required")
  .isLength({ max: 100 })
  .withMessage("name must contain at most 100 characters");
const priceValidation = body("unitPrice")
  .isFloat({ gt: 0, max: 9_999_999_999.99 })
  .withMessage("unitPrice must be a positive number")
  .toFloat();
const unitValidation = body("unit")
  .isIn(SHIPPING_UNITS)
  .withMessage(`unit must be one of: ${SHIPPING_UNITS.join(", ")}`);

shippingTypeRouter.post(
  "/",
  nameValidation,
  priceValidation,
  unitValidation,
  validateRequest,
  createShippingType,
);
shippingTypeRouter.get("/", listShippingTypes);
shippingTypeRouter.get("/:id", idValidation, validateRequest, getShippingType);
shippingTypeRouter.put(
  "/:id",
  idValidation,
  nameValidation.optional(),
  priceValidation.optional(),
  unitValidation.optional(),
  body().custom((_value, { req }) => {
    if (!["name", "unitPrice", "unit"].some((key) => req.body[key] !== undefined)) {
      throw new Error("At least one of name, unitPrice or unit is required");
    }
    return true;
  }),
  validateRequest,
  updateShippingType,
);
shippingTypeRouter.delete("/:id", idValidation, validateRequest, deleteShippingType);
shippingTypeRouter.post("/:id/restore", idValidation, validateRequest, restoreShippingType);
