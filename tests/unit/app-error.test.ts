import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "../../src/middleware/app-error.js";

describe("AppError", () => {
  it("stores the HTTP status and error code", () => {
    const error = new AppError("Resource not found", 404, "RESOURCE_NOT_FOUND");

    assert.equal(error.message, "Resource not found");
    assert.equal(error.statusCode, 404);
    assert.equal(error.code, "RESOURCE_NOT_FOUND");
  });
});
