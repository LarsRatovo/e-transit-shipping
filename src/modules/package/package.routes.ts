import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import {
  createPackage,
  deletePackage,
  getPackage,
  listPackages,
  restorePackage,
  updatePackage,
} from "./package.controller.js";
import {
  createPackageValidation,
  packageIdValidation,
  updatePackageValidation,
} from "./package.validation.js";

export const packageRouter = Router();

packageRouter.post(
  "/",
  createPackageValidation,
  validateRequest,
  createPackage,
);
packageRouter.get("/", listPackages);
packageRouter.get("/:id", packageIdValidation, validateRequest, getPackage);
packageRouter.put(
  "/:id",
  updatePackageValidation,
  validateRequest,
  updatePackage,
);
packageRouter.delete("/:id", packageIdValidation, validateRequest, deletePackage);
packageRouter.post("/:id/restore", packageIdValidation, validateRequest, restorePackage);
