import { PrismaPg } from '@prisma/adapter-pg';
import { env } from "~/env";
import { PrismaClient } from "~/generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const createPostgresClient = () =>
  new PrismaClient({
    adapter:adapter
   });

const globalForPostgres = globalThis as unknown as {
  postgresDb: ReturnType<typeof createPostgresClient> | undefined;
};

export const postgresDb =
  globalForPostgres.postgresDb ?? createPostgresClient();

if (env.NODE_ENV !== "production") globalForPostgres.postgresDb = postgresDb;
