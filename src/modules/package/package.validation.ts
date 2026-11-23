import { body, param } from "express-validator";

const idValidation = () =>
  param("id").isUUID().withMessage("id must be a valid UUID");

const clientValidation = () =>
  body("clientId")
    .isUUID()
    .withMessage("clientId must be a valid UUID");

const shippingTypeValidation = () =>
  body("shippingTypeId")
    .isUUID()
    .withMessage("shippingTypeId must be a valid UUID");

const measureValidation = () =>
  body("measure")
    .isFloat({ gt: 0, max: 999_999_999.999 })
    .withMessage("measure must be a positive number")
    .toFloat();

const priceValidation = () =>
  body("price")
    .isFloat({ gt: 0, max: 9_999_999_999.99 })
    .withMessage("price must be a positive number")
    .toFloat();

export const packageIdValidation = [idValidation()];

export const createPackageValidation = [
  clientValidation(),
  shippingTypeValidation(),
  measureValidation(),
  priceValidation(),
];

export const updatePackageValidation = [
  idValidation(),
  clientValidation(),
  shippingTypeValidation(),
  measureValidation(),
  priceValidation(),
];
