import { PrismaClient } from "generated/mongodb";
import { env } from "~/env";

const createMongoClient = () => {
  const client = new PrismaClient({
    datasourceUrl: env.MONGODB_URI, // MongoDB connection URL
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // Log when MongoDB is connected
  console.log("\x1b[36m%s\x1b[0m", "🍃 MongoDB Connected Successfully");

  return client;
};

const globalForMongo = globalThis as unknown as {
  mongoDb: ReturnType<typeof createMongoClient> | undefined;
};

export const mongoDb = globalForMongo.mongoDb ?? createMongoClient();

if (env.NODE_ENV !== "production") globalForMongo.mongoDb = mongoDb;
