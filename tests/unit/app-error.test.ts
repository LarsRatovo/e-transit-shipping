import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../src/middleware/app-error.js";

describe("AppError", () => {
  it("stores the HTTP status and error code", () => {
    const error = new AppError("Resource not found", 404, "RESOURCE_NOT_FOUND");

    expect(error).toMatchObject({
      message: "Resource not found",
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
    });
  });
});
