import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const createPostgresClient = () =>
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPostgres = globalThis as unknown as {
  postgresDb: ReturnType<typeof createPostgresClient> | undefined;
};

export const postgresDb =
  globalForPostgres.postgresDb ?? createPostgresClient();

if (env.NODE_ENV !== "production") globalForPostgres.postgresDb = postgresDb;
