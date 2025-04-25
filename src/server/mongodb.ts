import { MongoClient } from "mongodb";
import { env } from "~/env";
const uri = env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getMongoDB() {
  try {
    const client = await clientPromise;
    return client.db("readora");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
