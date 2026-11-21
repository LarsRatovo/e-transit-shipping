import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabase } from "./database/prisma.js";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`${env.serviceName} listening on http://localhost:${env.port}`);
  console.log(`Swagger UI available at http://localhost:${env.port}/api-docs`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received, shutting down`);
  server.close(async (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    try {
      await closeDatabase();
      process.exit(0);
    } catch (databaseError) {
      console.error(databaseError);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
