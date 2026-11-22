import type { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validateRequest: RequestHandler = (request, response, next) => {
  const result = validationResult(request);
  if (result.isEmpty()) {
    next();
    return;
  }

  response.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details: result.array().map(({ type: _type, ...error }) => error),
    },
  });
};
