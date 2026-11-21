import type { RequestHandler } from "express";
import { prisma } from "../../database/prisma.js";

export const getHealth: RequestHandler = async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    response.status(503).json({
      status: "unavailable",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
};
