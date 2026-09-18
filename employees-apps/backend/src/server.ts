import http from "node:http";

import app from "./app";
import { connectDatabase, closeDatabase } from "./config/database";

const PORT = Number(process.env.PORT) || 5000;
const SHUTDOWN_TIMEOUT = 10_000;

let server: http.Server | undefined;
let isShuttingDown = false;

const timestamp = (): string => {
  return new Date().toISOString();
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    console.log(`[${timestamp()}] Shutdown already in progress.`);

    return;
  }

  isShuttingDown = true;

  console.log(
    `[${timestamp()}] ${signal} received. Starting graceful shutdown...`,
  );

  const forceShutdownTimer = setTimeout(() => {
    console.error(
      `[${timestamp()}] Graceful shutdown timed out. Forcing shutdown.`,
    );

    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      console.log(`[${timestamp()}] HTTP server closed successfully.`);
    }

    await closeDatabase();

    console.log(`[${timestamp()}] All resources closed successfully.`);

    clearTimeout(forceShutdownTimer);

    process.exitCode = 0;
  } catch (error) {
    console.error(`[${timestamp()}] Error during graceful shutdown:`, error);

    clearTimeout(forceShutdownTimer);

    process.exitCode = 1;
  }
};

process.on("uncaughtException", (error: Error) => {
  console.error(`[${timestamp()}] UNCAUGHT EXCEPTION:`, error);

  void shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error(`[${timestamp()}] UNHANDLED REJECTION:`, reason);

  void shutdown("unhandledRejection");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

const startServer = async (): Promise<void> => {
  try {
    console.log(`[${timestamp()}] Starting application...`);

    await connectDatabase();

    server = app.listen(PORT, () => {
      console.log(
        `[${timestamp()}] Server running on http://localhost:${PORT}`,
      );

      console.log(
        `[${timestamp()}] Environment: ${
          process.env.NODE_ENV || "development"
        }`,
      );
    });

    server.on("error", (error: Error) => {
      console.error(`[${timestamp()}] HTTP server error:`, error);

      void shutdown("server error");
    });
  } catch (error) {
    console.error(`[${timestamp()}] Failed to start application:`, error);

    process.exitCode = 1;
  }
};

void startServer();
