import { PrismaClient } from "generated/mongodb";
import { env } from "~/env";

const createMongoClient = () =>
  new PrismaClient({
    datasourceUrl: env.MONGODB_URI, // MongoDB connection URL
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForMongo = globalThis as unknown as {
  mongoDb: ReturnType<typeof createMongoClient> | undefined;
};

export const mongoDb = globalForMongo.mongoDb ?? createMongoClient();

if (env.NODE_ENV !== "production") globalForMongo.mongoDb = mongoDb;
